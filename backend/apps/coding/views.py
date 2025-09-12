from datetime import datetime, timezone
from django.utils.timezone import now
from django_filters.rest_framework import DjangoFilterBackend
import logging
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from .serializers import CodingSessionSerializer
from .models import CodingSession
from apps.users.renderers import BooleanRenderer
from apps.users.models import Profile


logger = logging.getLogger(__name__)


# Create your views here.
class CodingViewSet(viewsets.ModelViewSet):
    queryset = CodingSession.objects.all()
    serializer_class = CodingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [BooleanRenderer, JSONRenderer, BrowsableAPIRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']

    def get_queryset(self):
        """Limit sessions to the authenticated user's profile sessions."""
        try:
            profile = self.request.user.profile
        except Profile.DoesNotExist:
            return CodingSession.objects.none()
        return CodingSession.objects.filter(user=profile)

    def perform_create(self, serializer):
        """Ensure the logged-in user's profile is set on creation."""
        profile = self.request.user.profile
        serializer.save(user=profile)


    @action(
        detail=False,
        methods=['post'],
        url_path='daily-github-task',
        permission_classes = [permissions.AllowAny]
    )
    def create_daily_github_coding_session(self, request):
        """Create coding session daily for all profiles with GitHub usernames."""
        secret = request.headers.get("X-Task-Key")
        if secret != settings.GITHUB_TASK_SECRET:
            return Response({"status": "forbidden"}, status=status.HTTP_403_FORBIDDEN)

        today = now().astimezone(timezone.utc).date()
        start_of_day = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)
        end_of_day = datetime.combine(today, datetime.max.time()).replace(tzinfo=timezone.utc)
        profiles = Profile.objects.exclude(github_username="").exclude(github_username__isnull=True)
        created_count = 0

        for profile in profiles:
            logger.info(f"Checking profile {profile.pk} ({profile.github_username})")

            session = CodingSession.objects.filter(
                user=profile,
                source="github",
                created_at__gte=start_of_day,
                created_at__lte=end_of_day
            ).first()

            if session:
                logger.info(f"Session already exists for {profile.pk}")
                continue

            try:
                duration = CodingSession(user=profile, source="github").get_duration_from_github()
                session = CodingSession(user=profile, source="github", duration=duration)
                session.save()
                created_count += 1
                logger.info(
                    f"Created session for {profile.pk} with duration {session.duration} "
                    f"and credits {session.credits_awarded}"
                )
            except Exception as e:
                logger.error(f"Error creating session for {profile.pk}: {e}")

        return Response({"status": "success", "created": created_count})
