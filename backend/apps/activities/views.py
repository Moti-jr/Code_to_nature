from django.shortcuts import render
from .serializers import ActivitiesSerializer
from .models import Activity
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.models import CustomUser
from datetime import datetime
from .utils import unlock_credits
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

# Create your views here.

class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitiesSerializer
    
    def create(self, request, *args, **kwargs):
            response = super().create(request, *args, **kwargs)
            return Response(
                {
                    "success": True,
                    "data": response.data
                },
                status=status.HTTP_201_CREATED
            )
    
    @action(detail=True, methods=['post'], permission_classes = [IsAdminUser])#custom viewset function
    def verify_activity(self, request, pk=None):
        try:
            activity = self.get_object()
            statuses = ['PENDING', 'REJECTED'] #do not verify an already verified activity
            if activity.status in statuses:
                activity.status = 'VERIFIED' #assigning new value of status
                activity.verified_on = datetime.now()
                activity.save()
                
                unlock_credits(activity) #performs unlocking the credit
                serializer = self.get_serializer(activity)

                return Response(
                            {"message": f"Activity verified successfully, {serializer.data}"},
                            status=status.HTTP_201_CREATED,
                )
            return Response(
                            {"message": f"Activity already verified, {serializer.data}"},
                            status=status.HTTP_400_BAD_REQUEST,
                )
            
        except Exception as e:
            return Response(
                            {"error occurred": str(e)}
            )