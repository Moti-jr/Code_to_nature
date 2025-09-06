from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Reward(models.Model):
    """
    Rewards available in the system.
    """
    CATEGORY_CHOICES = [
        ("environmental", "Environmental"),
        ("merchandise", "Merchandise"),
        ("digital", "Digital"),
    ]

    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    cost = models.PositiveIntegerField(help_text="Eco-credits required")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    icon = models.CharField(
        max_length=100,
        blank=True,
        help_text="Optional icon name or path (frontend decides rendering)"
    )
    available = models.BooleanField(default=True)
    popular = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.category} ({self.cost} credits)"


class Redemption(models.Model):
    """
    Record of a user redeeming a reward.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="redemptions")
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE, related_name="redemptions")
    cost = models.PositiveIntegerField(help_text="Eco-credits spent")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} redeemed {self.reward.name} on {self.date.strftime('%Y-%m-%d')}"
