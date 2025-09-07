from apps.users.models import CustomUser
from django.db import transaction



def unlock_credits(activity):
    #guiding to points :     #1hr coding time = 10 points
    duration_in_hrs =(activity.duration / 60)
    user_profile =  activity.user.profile
    locked_credits =user_profile.locked_credits
    points_to_unlock = duration_in_hrs * 10
    #check activity verification status before update to prevent actions on other activities that have not verified
    try:
        if activity.status == 'VERIFIED':
            with transaction.atomic():#ensures to fully update or rollback
                #to not have more points than the locked credit and prevent neg values
                points_to_unlock = max(0, min(points_to_unlock, locked_credits)) 
                user_profile.locked_credits -= points_to_unlock  
                user_profile.eco_credits += points_to_unlock 
                user_profile.save()
    except Exception as e:
        return(str(e))
    
    return points_to_unlock