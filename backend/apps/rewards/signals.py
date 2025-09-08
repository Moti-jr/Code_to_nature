from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

from .models import Redemption, Reward

@receiver(post_save, sender=Redemption)
def handle_reward_redemption(sender, instance, created, **kwargs):
    """
    Handle actions after a reward is redeemed.
    """
    if created:
        # Log redemption for analytics
        print(f"✅ Redemption logged: {instance.user.username} redeemed {instance.reward.name}")


@receiver(post_save, sender=Redemption)
def check_milestone_achievements(sender, instance, created, **kwargs):
    """
    Check if user has reached redemption milestones.
    """
    if not created:
        return
    
    user_redemption_count = Redemption.objects.filter(user=instance.user).count()
    
    # Define milestone rewards
    milestones = {
        1: "First Redemption! 🎉",
        5: "Eco-Warrior! 🌿",
        10: "Nature Lover! 🌳",
        25: "Green Champion! 🏆",
        50: "Eco-Legend! 🌍"
    }
    
    if user_redemption_count in milestones:
        milestone_message = milestones[user_redemption_count]
        #Notify MileStone Actived
        print(f"🏅 Milestone achieved: {instance.user.username} - {milestone_message}")


@receiver(post_save, sender=Reward)
def reward_availability_changed(sender, instance, created, **kwargs):
    """
    Handle reward availability changes.
    """
    if not created and not instance.available:
        # Reward was made unavailable
        print(f"⚠️ Reward made unavailable: {instance.name}")


@receiver(pre_delete, sender=Redemption)
def handle_redemption_deletion(sender, instance, **kwargs):
    """
    Handle redemption deletion (for admin purposes).
    """
    # Log the deletion for audit purposes
    print(f"🗑️ Redemption deleted: {instance.user.username} - {instance.reward.name}")


def update_reward_popularity():
    """
    Utility function to update reward popularity based on redemption frequency.
    This could be called by a periodic task (Celery).
    """
    from django.db.models import Count
    
    # Get rewards with redemption counts in the last 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    popular_rewards = Redemption.objects.filter(
        date__gte=thirty_days_ago
    ).values('reward').annotate(
        redemption_count=Count('id')
    ).filter(redemption_count__gte=5)  # Popular if redeemed 5+ times in 30 days
    
    # Update popular status
    Reward.objects.update(popular=False)  # Reset all
    
    for item in popular_rewards:
        Reward.objects.filter(id=item['reward']).update(popular=True)
    
    print(f"📊 Updated popularity for {len(popular_rewards)} rewards")


from django.dispatch import Signal

# Custom signal for when a user runs out of credits
user_low_credits = Signal()

@receiver(user_low_credits)
def handle_low_credits(sender, user, remaining_credits, **kwargs):
    """
    Handle when a user has low credits.
    """
    print(f"⚠️ {user.username} has low credits: {remaining_credits}")