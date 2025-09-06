from django.urls import path
from . import views

app_name = 'leaderboard'

urlpatterns = [
    path('top-eco-credits/', views.top_eco_credits, name='top_eco_credits'),
    path('friends/', views.leaderboard_with_friends, name='leaderboard_with_friends'),
]