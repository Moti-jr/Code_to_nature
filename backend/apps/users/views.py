from rest_framework import viewsets, permissions
from .serializers import CustomerUserSerializer, ProfileSerializer
from .models import CustomUser, Profile

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomerUserSerializer
    permission_classes = [permissions.AllowAny]

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
