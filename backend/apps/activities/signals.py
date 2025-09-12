# apps/activities/signals.py

import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Activity  
from apps.coding.models import CodingSession

logger = logging.getLogger(__name__)

# Points multiplier based on activity type
ACTIVITY_POINTS = {
    "family_meetup": 5,
    "hiking": 12,
    "walking": 8,
    "running": 200,
    "cycling": 20,
    "climbing": 25,
    "camping": 10,
    "gardening": 7,
    "other": 10,
}

@receiver(post_save, sender=Activity)
def unlock_credits_signal(sender, instance, created, **kwargs):
    """
    Unlock eco-credits for a user when an activity is verified.
    Also uses unlocked points to progressively unlock CodingSessions (FIFO).
    Leftover points are stored for future unlocking.
    """
    activity = instance

    # Run only when the activity is updated (not created)
    if created:
        return

    if activity.status == "VERIFIED":
        try:
            with transaction.atomic():
                user_profile = activity.user.profile
                locked_credits = user_profile.locked_credits

                # duration in hours
                duration = activity.duration
                duration_in_hrs = duration.hour + duration.minute / 60 + duration.second / 3600

                # get multiplier (default 10 if activity not listed)
                multiplier = ACTIVITY_POINTS.get(activity.activity.lower(), 2)

                # calculate points
                points_to_unlock = duration_in_hrs * multiplier

                # Ensure valid unlocking (no negative or over-unlock)
                points_to_unlock = max(0, min(points_to_unlock, locked_credits))

                if points_to_unlock > 0:
                    user_profile.locked_credits -= points_to_unlock
                    user_profile.eco_credits += points_to_unlock

                    # Also add to points_to_unlock pool
                    user_profile.points_to_unlock += points_to_unlock

                    user_profile.save(
                        update_fields=["locked_credits", "eco_credits", "points_to_unlock"]
                    )


                    logger.info(
                        f"Unlocked {points_to_unlock:.2f} eco-credits for {user_profile.user.username} "
                        f"({activity.activity}, {duration_in_hrs:.2f} hrs)"
                    )
                    
                    # Now unlock CodingSessions in FIFO order
                    # Use available points to unlock coding sessions FIFO
                    locked_sessions = CodingSession.objects.filter(
                        user=user_profile, status="locked"
                    ).order_by("created_at")

                    for session in locked_sessions:
                        if user_profile.points_to_unlock <= 0:
                            break

                        cost = session.credits_awarded
                        if user_profile.points_to_unlock >= cost:
                            session.unlock()
                            user_profile.points_to_unlock -= cost
                            logger.info(
                                f"Unlocked CodingSession {session.session_name} for {user_profile.user.username} "
                                f"using {cost} points."
                            )
                        else:
                            break  # not enough points left to unlock next session

                    # Save updated remaining points
                    user_profile.save(update_fields=["points_to_unlock"])

        except Exception as e:
            logger.error(f"Error unlocking credits: {str(e)}")

    elif activity.status == "REJECTED":
        # No credits are unlocked on rejection, just log the event
        logger.info(f"Activity {activity.id} rejected; no credits unlocked.")