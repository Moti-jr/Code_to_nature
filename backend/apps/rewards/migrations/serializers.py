from rest_framework import serializers
from .models import Reward, Redemption


class RewardSerializer(serializers.ModelSerializer):
   
    redemption_count = serializers.SerializerMethodField()
    can_afford = serializers.SerializerMethodField()
    
    class Meta:
        model = Reward
        fields = [
            "id",
            "name", 
            "description",
            "cost",
            "category",
            "icon", 
            "available",
            "popular",
            "created_at",
            "redemption_count",
            "can_afford"
        ]

    def get_redemption_count(self, obj):
        
        return obj.redemptions.count()

    def get_can_afford(self, obj):
        
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            
            user_credits = getattr(request.user, 'eco_credits', 0)
            return user_credits >= obj.cost
        return False



class SimpleRewardSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Reward
        fields = [
            "id",
            "name",
            "description", 
            "cost",
            "category",
            "icon",
            "available",
            "popular",
            "created_at",
        ]


class RedemptionSerializer(serializers.ModelSerializer):
    
    reward_name = serializers.CharField(source='reward.name', read_only=True)
    reward_category = serializers.CharField(source='reward.category', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Redemption
        fields = [
            'id', 'user', 'reward', 'cost', 'date',
            'reward_name', 'reward_category', 'user_username'
        ]
        read_only_fields = ['id', 'date', 'reward_name', 'reward_category', 'user_username']


