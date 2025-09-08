from django.urls import path
from . import views

urlpatterns = [
    # Reward listing and details
    path('', views.RewardListView.as_view(), name='reward-list'),
    path('<int:pk>/', views.RewardDetailView.as_view(), name='reward-detail'),

    # Popular and categorized rewards
    path('popular/', views.PopularRewardsView.as_view(), name='popular-rewards'),
    path('categories/', views.RewardCategoriesView.as_view(), name='reward-categories'),
    path('affordable/', views.affordable_rewards, name='affordable-rewards'),
    
    # Redemption endpoints
    path('redemptions/', views.UserRedemptionListView.as_view(), name='user-redemptions'),
    path('redeem/', views.redeem_reward, name='redeem-reward'),

     # User statistics
    path('stats/', views.user_stats, name='user-stats'),
]
