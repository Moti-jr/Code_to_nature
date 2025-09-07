from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Reward, Redemption
from .serializers import RewardSerializer, RedemptionSerializer


class RewardListView(generics.ListAPIView):
    
    serializer_class = RewardSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'available', 'popular']
    search_fields = ['name', 'description']
    ordering_fields = ['cost', 'created_at', 'name']
    ordering = ['cost']  

    def get_queryset(self):
        queryset = Reward.objects.all()

        
        min_cost = self.request.query_params.get('min_cost')
        max_cost = self.request.query_params.get('max_cost')
        if min_cost:
            queryset = queryset.filter(cost__gte=min_cost)
        if max_cost:
            queryset = queryset.filter(cost__lte=max_cost)

        
        affordable = self.request.query_params.get('affordable')
        if affordable and affordable.lower() == 'true':
            if self.request.user.is_authenticated:
                user_credits = getattr(self.request.user, 'eco_credits', 0)
                queryset = queryset.filter(cost__lte=user_credits)

        return queryset


class RewardDetailView(generics.RetrieveAPIView):
    
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer


class UserRedemptionListView(generics.ListAPIView):
    
    serializer_class = RedemptionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date']
    ordering = ['-date']  

    def get_queryset(self):
        return Redemption.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def redeem_reward(request):
    
    try:
        reward_id = request.data.get('reward_id')
        if not reward_id:
            return Response({'error': 'reward_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        reward = Reward.objects.get(id=reward_id, available=True)

       
        user_credits = getattr(request.user, 'eco_credits', 0)
        if user_credits < reward.cost:
            return Response({'error': 'Insufficient eco-credits'}, status=status.HTTP_400_BAD_REQUEST)

        
        redemption = Redemption.objects.create(
            user=request.user,
            reward=reward,
            cost=reward.cost
        )

       

        serializer = RedemptionSerializer(redemption)
        return Response(
            {'message': f'Successfully redeemed {reward.name}!', 'redemption': serializer.data},
            status=status.HTTP_201_CREATED
        )

    except Reward.DoesNotExist:
        return Response({'error': 'Reward not found or not available'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
