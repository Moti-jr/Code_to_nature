from rest_framework import viewsets, permissions
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from .serializers import CustomerUserSerializer, ProfileSerializer
from .models import CustomUser, Profile
from .renderers import BooleanRenderer


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomerUserSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [BooleanRenderer, JSONRenderer, BrowsableAPIRenderer]


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [BooleanRenderer, JSONRenderer, BrowsableAPIRenderer]
