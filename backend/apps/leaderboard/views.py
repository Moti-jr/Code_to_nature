from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from apps.users.models import Profile

# Create your views here.

def format_user_data(profile, rank=None, include_user_id=False):
    """
    Helper function to format user profile data consistently across endpoints.
    
    Args:
        profile: Profile instance
        rank: User's rank in the leaderboard (optional)
        include_user_id: Whether to include user_id in the response
    
    Returns:
        Dictionary with formatted user data
    """
    user_data = {
        'username': profile.user.username,
        'eco_credits': profile.eco_credits,
        'current_streak': profile.current_streak,
        'longest_streak': profile.longest_streak,
        'github_username': profile.github_username if profile.github_username else None
    }
    
    if rank is not None:
        user_data['rank'] = rank
    
    if include_user_id:
        user_data['user_id'] = profile.user.id
    
    return user_data


def get_user_rank(profile):
    """
    Helper function to calculate a user's rank based on eco_credits.
    
    Args:
        profile: Profile instance
    
    Returns:
        Integer representing the user's rank
    """
    return Profile.objects.filter(eco_credits__gt=profile.eco_credits).count() + 1

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
        
        # Build the response data using helper function
        leaderboard_data = [
            format_user_data(profile, rank=rank)
            for rank, profile in enumerate(top_profiles, 1)
        ]
        
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
        
        # Build leaderboard data using helper function
        leaderboard_data = [
            format_user_data(profile, rank=rank, include_user_id=True)
            for rank, profile in enumerate(top_profiles, 1)
        ]
        
        user_position = None
        friends_positions = []
        
        # Check if user is in top list
        if user_id:
            for user_data in leaderboard_data:
                if str(user_data['user_id']) == user_id:
                    user_position = user_data
                    break
        
        # If user_id is provided but user not in top list, find their actual position
        if user_id and not user_position:
            try:
                user_profile = Profile.objects.select_related('user').get(user_id=user_id)
                user_rank = get_user_rank(user_profile)
                user_position = format_user_data(user_profile, rank=user_rank, include_user_id=True)
                
                # Get friends' positions using helper functions
                friends = user_profile.friends.select_related('user').order_by('-eco_credits')
                friends_positions = [
                    format_user_data(friend, rank=get_user_rank(friend), include_user_id=True)
                    for friend in friends
                ]
                    
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
