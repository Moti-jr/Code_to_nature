import requests
from datetime import datetime, date, timedelta
from django.db import models
from apps.users.models import Profile


# Create your models here.
class CodingSession(models.Model):
    """Model for user's coding sessions"""
    SOURCE_CHOICES = [
        ('manual', 'Manual Entry'),
        ('github', 'GitHub'),
    ]
    user = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='coding_sessions'
    )
    duration = models.DurationField(default=timedelta())
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    credits_awarded = models.IntegerField(default=0)

    def get_duration_from_github(self):
        """get duration of coding session from github"""
        username = self.user.github_username
        github_token = self.user.github_token
        if not username:
            return None

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
            return None

        try:
            events = response.json()
        except ValueError:
            return None

        # Parse created_at into datetime object
        for item in events:
            if "created_at" in item:
                item["created_at"] = datetime.fromisoformat(
                    item["created_at"].replace('Z', '+00:00')
                )

        today = datetime.now().date()
        todays_events = [
            item for item in events
            if "created_at" in item and item["created_at"].date() == today
        ]

        if not todays_events:
            return None

        # sort today's events by earliest created
        todays_events_sorted = sorted(
            todays_events, key=lambda x: x["created_at"]
        )

        # get start_time and end_time
        start_time = todays_events_sorted[0]["created_at"]
        end_time = todays_events_sorted[-1]["created_at"]
        duration = end_time - start_time
        if duration < timedelta(0):
            return None
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
            self.duration = self.get_duration_from_github()
        if self.duration is None:
            return 0
        total_minutes = self.duration.total_seconds() / 60
        interval_of_30_mins = total_minutes // 30

        credits = int(interval_of_30_mins * 5)
        return credits

    def save(self, *args, **kwargs):
        """Save coding session with credits"""
        self.credits_awarded = self.award_credits()

        super().save(*args, **kwargs)

    def __str__(self):
        """String representation of the CodingSession"""
        return (
            f"CodingSession(user={self.user},"
            f"duration={self.duration},"
            f"source={self.source},"
            f"created_at={self.created_at})"
        )
