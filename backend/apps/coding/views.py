from rest_framework import viewsets, permissions, filters
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CodingSessionSerializer
from .models import CodingSession
from apps.users.renderers import BooleanRenderer


# Create your views here.
class CodingViewSet(viewsets.ModelViewSet):
    queryset = CodingSession.objects.all()
    serializer_class = CodingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [BooleanRenderer, JSONRenderer, BrowsableAPIRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']
