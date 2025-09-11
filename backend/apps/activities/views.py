from django.shortcuts import render
from .serializers import ActivitiesSerializer
from .models import Activity
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.models import CustomUser
from datetime import datetime
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticated

# Create your views here.

class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitiesSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
            response = super().create(request, *args, **kwargs)
            return Response(
                {
                    "success": True,
                    "data": response.data
                },
                status=status.HTTP_201_CREATED
            )
   