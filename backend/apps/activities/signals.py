# activities/signals.py
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.db import transaction
from datetime import timedelta
import logging
from .models import Activity

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Activity)
def track_status_change(sender, instance, **kwargs):
    if instance.pk:
        old_status = sender.objects.get(pk=instance.pk).status
        instance._old_status = old_status  # make consistent


@receiver(post_save, sender=Activity)
def handle_activity_verification(sender, instance, created, **kwargs):
    if not created and getattr(instance, "_old_status", None) != "VERIFIED" and instance.status == "VERIFIED":
        unlock_credits(instance)  # pass the instance directly


def time_in_hrs(t):
    delta = timedelta(hours=t.hour, minutes=t.minute, seconds=t.second)
    return delta.total_seconds() / 3600


def unlock_credits(activity):
    # activity is already the instance
    duration_in_hrs = time_in_hrs(activity.duration)
    user_profile = activity.user.profile
    locked_credits = user_profile.locked_credits
    points_to_unlock = duration_in_hrs * 10

    try:
        if activity.status == "VERIFIED":
            with transaction.atomic():
                points_to_unlock = max(0, min(points_to_unlock, locked_credits))
                user_profile.locked_credits -= points_to_unlock
                user_profile.eco_credits += points_to_unlock
                user_profile.save()

                logger.info(
                    f"Added eco-credits for user {user_profile} as {user_profile.eco_credits}"
                )
    except Exception as e:
        logger.error(f"Error occurred {str(e)}")
        return str(e)

    return points_to_unlock
