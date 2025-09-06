from django.shortcuts import render
from .serializers import ActivitiesSerializer
from .models import Activity
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.models import CustomUser
from datetime import datetime
from .utils import unlock_credits

# Create your views here.

class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitiesSerializer
    
    @action(detail=True, methods=['post'])#custom viewset function
    def verify_activity(self, request, pk=None):
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
        