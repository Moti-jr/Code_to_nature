from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from apps.users.models import Profile

# Create your views here.

@require_http_methods(["GET"])
def top_eco_credits(request):
    """
    Endpoint that returns top 10 users ranked by eco_credits.
    
    Returns:
        JSON response with top 10 users and their eco_credits
    """
    try:
        # Query top 10 profiles ordered by eco_credits in descending order
        top_profiles = Profile.objects.select_related('user').order_by('-eco_credits')[:10]
        
        # Build the response data
        leaderboard_data = []
        for rank, profile in enumerate(top_profiles, 1):
            leaderboard_data.append({
                'rank': rank,
                'username': profile.user.username,
                'eco_credits': profile.eco_credits,
                'current_streak': profile.current_streak,
                'longest_streak': profile.longest_streak,
                'github_username': profile.github_username if profile.github_username else None
            })
        
        return JsonResponse({
            'success': True,
            'data': leaderboard_data,
            'total_users': len(leaderboard_data)
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def leaderboard_with_friends(request):
    """
    Enhanced leaderboard endpoint that shows user's position and friends' positions.
    
    Query parameters:
        - user_id: ID of the user to find their position and friends
        - limit: Number of top users to return (default: 10)
    
    Returns:
        JSON response with leaderboard data including user's position
    """
    try:
        user_id = request.GET.get('user_id')
        limit = int(request.GET.get('limit', 10))
        
        # Get top users
        top_profiles = Profile.objects.select_related('user').order_by('-eco_credits')[:limit]
        
        leaderboard_data = []
        user_position = None
        friends_positions = []
        
        for rank, profile in enumerate(top_profiles, 1):
            user_data = {
                'rank': rank,
                'user_id': profile.user.id,
                'username': profile.user.username,
                'eco_credits': profile.eco_credits,
                'current_streak': profile.current_streak,
                'longest_streak': profile.longest_streak,
                'github_username': profile.github_username if profile.github_username else None
            }
            leaderboard_data.append(user_data)
            
            # Track user's position if user_id is provided
            if user_id and str(profile.user.id) == user_id:
                user_position = user_data
        
        # If user_id is provided but user not in top list, find their actual position
        if user_id and not user_position:
            try:
                user_profile = Profile.objects.select_related('user').get(user_id=user_id)
                user_rank = Profile.objects.filter(eco_credits__gt=user_profile.eco_credits).count() + 1
                user_position = {
                    'rank': user_rank,
                    'user_id': user_profile.user.id,
                    'username': user_profile.user.username,
                    'eco_credits': user_profile.eco_credits,
                    'current_streak': user_profile.current_streak,
                    'longest_streak': user_profile.longest_streak,
                    'github_username': user_profile.github_username if user_profile.github_username else None
                }
                
                # Get friends' positions
                friends = user_profile.friends.select_related('user').order_by('-eco_credits')
                for friend in friends:
                    friend_rank = Profile.objects.filter(eco_credits__gt=friend.eco_credits).count() + 1
                    friends_positions.append({
                        'rank': friend_rank,
                        'user_id': friend.user.id,
                        'username': friend.user.username,
                        'eco_credits': friend.eco_credits,
                        'current_streak': friend.current_streak,
                        'longest_streak': friend.longest_streak,
                        'github_username': friend.github_username if friend.github_username else None
                    })
                    
            except Profile.DoesNotExist:
                pass
        
        response_data = {
            'success': True,
            'data': {
                'leaderboard': leaderboard_data,
                'user_position': user_position,
                'friends_positions': friends_positions,
                'total_users_shown': len(leaderboard_data)
            }
        }
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
