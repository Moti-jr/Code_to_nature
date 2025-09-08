from rest_framework import serializers
from .models import Reward, Redemption


class RewardSerializer(serializers.ModelSerializer):
    """
    Serializer for Reward model.
    """
    redemption_count = serializers.SerializerMethodField()
    can_afford = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Reward
        fields = [
            'id', 'name', 'description', 'cost', 'category','available',
            'category_display', 'icon', 'popular', 'created_at','redemption_count','can_afford'
        ]
        read_only_fields = ['id', 'created_at']

    def get_redemption_count(self, obj):
        
        return obj.redemptions.count()

    def get_can_afford(self, obj):
        
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            
            user_credits = getattr(request.user, 'eco_credits', 0)
            return user_credits >= obj.cost
        return False

class RedemptionSerializer(serializers.ModelSerializer):
    """
    Serializer for Redemption model.
    """
    reward_name = serializers.CharField(source='reward.name', read_only=True)
    reward_category = serializers.CharField(source='reward.category', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    reward_icon = serializers.CharField(source='reward.icon', read_only=True)

    class Meta:
        model = Redemption
        fields = [
            'id', 'reward', 'cost', 'date','reward_icon',
            'reward_name', 'reward_category', 'username','cost', 'date', 
        ]
        read_only_fields = ['id', 'date', 'username']


class RedeemRewardSerializer(serializers.Serializer):
    """
    Serializer for redeeming a reward.
    """
    reward_id = serializers.IntegerField()
    
    def validate_reward_id(self, value):
        """
        Validate that the reward exists and is available.
        """
        try:
            reward = Reward.objects.get(id=value)
            if not reward.available:
                raise serializers.ValidationError("This reward is not available.")
            return value
        except Reward.DoesNotExist:
            raise serializers.ValidationError("Reward does not exist.")


class RedemptionStatsSerializer(serializers.Serializer):
    """
    Serializer for user redemption statistics.
    """
    total_redemptions = serializers.IntegerField()
    total_spent = serializers.IntegerField()
    favorite_category = serializers.CharField()
    recent_redemptions = RedemptionSerializer(many=True)