from django.urls import path
from . import views

urlpatterns = [

    path('rewards/', views.RewardListView.as_view(), name='reward-list'),
    path('rewards/<int:pk>/', views.RewardDetailView.as_view(), name='reward-detail'),

    
    path('redemptions/', views.UserRedemptionListView.as_view(), name='user-redemptions'),
    path('redeem/', views.redeem_reward, name='redeem-reward'),
]
