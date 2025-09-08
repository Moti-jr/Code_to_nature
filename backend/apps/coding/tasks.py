from celery import shared_task
from django.utils.timezone import now
from .models import CodingSession
from apps.users.models import Profile
import logging
from datetime import timedelta


logger = logging.getLogger(__name__)


@shared_task
def create_daily_github_coding_session():
    """Create coding session daily for all profiles with GitHub usernames."""
    today = now().date()
    profiles = Profile.objects.exclude(github_username="").exclude(github_username__isnull=True)

    for profile in profiles:
        print(f"Checking profile {profile.pk} ({profile.github_username})")
        logger.info(f"Checking profile {profile.pk} ({profile.github_username})")

        exists = CodingSession.objects.filter(
            user=profile,
            source="github",
            created_at__date=today
        ).exists()

        if not exists:
            try:
                temp_session = CodingSession(user=profile, source="github")
                duration = temp_session.get_duration_from_github()
                if duration is None:
                    duration = timedelta()
                CodingSession.objects.create(
                    user=profile,
                    source="github",
                    duration=duration
                )
                print(f"Created session for {profile.pk}")
                logger.info(f"Created session for {profile.pk}")
            except Exception as e:
                print(f"Error for {profile.pk}: {e}")
                logger.error(f"Error for {profile.pk}: {e}")
