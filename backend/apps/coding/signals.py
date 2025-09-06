from .models import CodingSession
from django.dispatch import receiver
from django.db.models.signals import post_save

@receiver(post_save, sender=CodingSession)
def add_locked_credits(sender, instance, created, **kwargs):
    """Updates locked_credits when user is awarded credits from coding"""
    if created:
        profile = instance.user
        profile.locked_credits += instance.credits_awarded
        profile.save()
