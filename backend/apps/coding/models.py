import requests
from datetime import datetime, timedelta
from django.utils.timezone import now
from datetime import timezone
from django.db import models
from apps.users.models import Profile
import logging

logger = logging.getLogger(__name__)


# Create your models here.
class CodingSession(models.Model):
    """Model for user's coding sessions"""
    SOURCE_CHOICES = [
        ('manual', 'Manual Entry'),
        ('github', 'GitHub'),
    ]

    STATUS_CHOICES = [
        ('locked', 'Locked'),
        ('unlocked', 'Unlocked'),
    ]

    user = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='coding_sessions'
    )
    session_name = models.CharField(max_length=250, blank=True, null=True)
    duration = models.DurationField(default=timedelta())
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    credits_awarded = models.IntegerField(default=0)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='locked'
    )

    def get_duration_from_github(self):
        """get duration of coding session from github"""
        username = self.user.github_username
        github_token = self.user.github_token
        if not username:
            return timedelta()

        url_request = f"https://api.github.com/users/{username}/events"
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if github_token:
            headers["Authorization"] = f"Bearer {github_token}"

        try:
            response = requests.get(url_request, headers=headers)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.warning("Github API fail")
            return timedelta()

        try:
            events = response.json()
        except ValueError:
            return timedelta()
        
        ALLOWED_EVENT_TYPES = {
            "PushEvent",
            "PullRequestEvent",
            "PullRequestReviewEvent",
            "IssuesEvent",
            "IssueCommentEvent",
        }

        # Parse created_at into datetime object
        valid_events = []
        for item in events:
            if item.get("type") in ALLOWED_EVENT_TYPES:
                try:
                    ts = datetime.fromisoformat(item["created_at"].replace("Z", "+00:00")).astimezone(timezone.utc)
                    valid_events.append(ts)
                except Exception as e:
                    logger.warning(f"failed to parse Github events date for {username}: {e}")

        if not valid_events:
            logger.info(f"No valid events for {username}")
            return timedelta(minutes=0)
        today_utc = now().astimezone(timezone.utc).date()
        logger.info(f"Event datetimes: {[t.isoformat() for t in valid_events]}")
        logger.info(f"Today (UTC): {today_utc}")
        todays_events = [t for t in valid_events if t.date() == today_utc]
        logger.info(f"Todays events: {[t.isoformat() for t in todays_events]}")

        if not todays_events:
            logger.info(f"No events for today for {username}")
            return timedelta(minutes=0)

        # Compute duration
        start_time = min(todays_events)
        end_time = max(todays_events)
        duration = end_time - start_time
        if duration < timedelta(0):
            return timedelta(minutes=0)
        elif duration == timedelta(0):
            return timedelta(minutes=30)
        
        logger.info(f"{username}: {len(todays_events)} events today, duration={duration}")
        print(duration)
        return duration

    @property
    def tracking_source(self):
        """Source from which coding session is tracked daily,
        Either manual entry or git profile commits
        """
        return self.source

    def award_credits(self):
        """Credits are awarded based on coding duration"""
        if self.source == 'github':
            self.duration = self.get_duration_from_github() or timedelta()
        total_minutes = self.duration.total_seconds() / 60
        interval_of_30_mins = total_minutes // 30

        credits = int(interval_of_30_mins * 5)
        return credits

    def save(self, *args, **kwargs):
        """Save coding session with credits"""
        self.credits_awarded = self.award_credits()

        super().save(*args, **kwargs)

    def unlock(self):
        """Unlock this session"""
        self.status = 'unlocked'
        self.save(update_fields=['status'])

    def __str__(self):
        """String representation of the CodingSession"""
        return (
            f"CodingSession(user={self.user},"
            f"duration={self.duration},"
            f"source={self.source},"
            f"status={self.status}, "
            f"created_at={self.created_at})"
        )

