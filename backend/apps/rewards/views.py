
# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone

from .models import Reward, Redemption
from .serializers import RewardSerializer, RedemptionSerializer, RedeemRewardSerializer
from apps.users.models import Profile 

class RewardListView(generics.ListAPIView):
    """
    List all available rewards.
    Supports filtering by category and popularity.
    """
    serializer_class = RewardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Reward.objects.filter(available=True)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by popularity
        popular = self.request.query_params.get('popular')
        if popular and popular.lower() == 'true':
            queryset = queryset.filter(popular=True)
        
        return queryset.order_by('cost', 'name')


class RewardDetailView(generics.RetrieveAPIView):
    """
    Get details of a specific reward.
    """
    queryset = Reward.objects.filter(available=True)
    serializer_class = RewardSerializer
    permission_classes = [IsAuthenticated]


class UserRedemptionListView(generics.ListAPIView):
    """
    List all redemptions for the authenticated user.
    """
    serializer_class = RedemptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Redemption.objects.filter(user=self.request.user).order_by('-date')



# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def redeem_reward(request):
#     """
#     Redeem a reward for the authenticated user.
#     Checks if user has enough eco-credits and deducts them.
#     """    
#     try:
#         reward_id = request.data.get('reward_id')
#         if not reward_id:
#             return Response({'error': 'reward_id is required'}, status=status.HTTP_400_BAD_REQUEST)

#         reward = Reward.objects.get(id=reward_id, available=True)

       
#         user_credits = getattr(request.user, 'eco_credits', 0)
#         if user_credits < reward.cost:
#             return Response({'error': 'Insufficient eco-credits'}, status=status.HTTP_400_BAD_REQUEST)

        
#         redemption = Redemption.objects.create(
#             user=request.user,
#             reward=reward,
#             cost=reward.cost
#         )

       

#         serializer = RedemptionSerializer(redemption)
#         return Response(
#             {'message': f'Successfully redeemed {reward.name}!', 'redemption': serializer.data},
#             status=status.HTTP_201_CREATED
#         )

#     except Reward.DoesNotExist:
#         return Response({'error': 'Reward not found or not available'}, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def redeem_reward(request):
    """
    Redeem a reward for the authenticated user.
    Checks if user has enough eco-credits and deducts them.
    """
    serializer = RedeemRewardSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    reward_id = serializer.validated_data['reward_id']
    reward = get_object_or_404(Reward, id=reward_id, available=True)
    
    try:
        # Get or create user profile
        user_profile, created = Profile.objects.get_or_create(
            user=request.user,
            defaults={'eco_credits': 0}
        )
        
        # Check if user has enough credits
        if user_profile.eco_credits < reward.cost:
            return Response({
                'error': 'Insufficient eco-credits',
                'required': reward.cost,
                'available': user_profile.eco_credits
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Perform the redemption in a transaction
        with transaction.atomic():
            # Deduct credits from user
            user_profile.eco_credits -= reward.cost
            user_profile.save()
            
            # Create redemption record
            redemption = Redemption.objects.create(
                user=request.user,
                reward=reward,
                cost=reward.cost
            )
        
        return Response({
            'success': True,
            'message': f'Successfully redeemed {reward.name}',
            'redemption': RedemptionSerializer(redemption).data,
            'remaining_credits': user_profile.eco_credits
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': 'Redemption failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """
    Get user's reward-related statistics.
    """
    try:
        user_profile = Profile.objects.get(user=request.user)
        eco_credits = user_profile.eco_credits
    except Profile.DoesNotExist:
        eco_credits = 0
    
    total_redemptions = Redemption.objects.filter(user=request.user).count()
    total_spent = sum(
        redemption.cost for redemption in 
        Redemption.objects.filter(user=request.user)
    )
    
    recent_redemptions = Redemption.objects.filter(
        user=request.user
    ).order_by('-date')[:5]
    
    return Response({
        'eco_credits': eco_credits,
        'total_redemptions': total_redemptions,
        'total_credits_spent': total_spent,
        'recent_redemptions': RedemptionSerializer(recent_redemptions, many=True).data
    })


class PopularRewardsView(generics.ListAPIView):
    """
    List popular rewards.
    """
    queryset = Reward.objects.filter(available=True, popular=True)
    serializer_class = RewardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return super().get_queryset().order_by('cost')


class RewardCategoriesView(generics.ListAPIView):
    """
    List available reward categories with counts.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        categories = Reward.objects.filter(available=True).values_list('category', flat=True).distinct()
        
        category_data = []
        for category in categories:
            count = Reward.objects.filter(available=True, category=category).count()
            category_data.append({
                'category': category,
                'display_name': dict(Reward.CATEGORY_CHOICES)[category],
                'count': count
            })
        
        return Response(category_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def affordable_rewards(request):
    """
    Get rewards that the user can afford with their current eco-credits.
    """
    try:
        user_profile = Profile.objects.get(user=request.user)
        eco_credits = user_profile.eco_credits
    except Profile.DoesNotExist:
        eco_credits = 0
    
    affordable_rewards = Reward.objects.filter(
        available=True,
        cost__lte=eco_credits
    ).order_by('cost')
    
    return Response({
        'user_credits': eco_credits,
        'affordable_rewards': RewardSerializer(affordable_rewards, many=True).data
    })