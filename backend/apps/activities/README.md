# Activities app
App enables users to create activities as evidence of them performing the outdoor activity.
Once the activity is  verified by the admin of the system, the users locked credits become eco_credits based on the duration 
of their activity.


## Features
Activity creation and update for the custom user.
Activity verification by admin
Conversion of Locked credits to Eco_credits


## Endpoints
Creation and update of activity  : 
POST request to f{base_url}/api/activities/
content-type : application/json
Payload:
   {
     "success": true,
    "data": {
    "user": 1,
    "duration": 60,
    "verification_proof": .png,
    "status": null,
    "location": "",
    "activity_date": 2025-09-07,
    "description": "",
    "activity": "family_meetup"
    }
}

Response:
{
    "id": 9,
    "user": 1,
    "duration": 60,
    "verification_proof": "http://localhost:8000/media/activities/IMG_0329.JPG",
    "status": "PENDING",
    "location": null,
    "activity_date": "2025-09-07",
    "description": null,
    "activity": "family_meetup"
}

Verifying activity
`POST /api/activities/{id}/verify_activity/`

**Permissions:**  
- Requires `IsAdminUser` (only staff/superuser accounts can call this action).  
- Non-admin users will receive a `403 Forbidden`.

**Request Example (as admin):**
POST /api/activities/1/verify_activity/
Authorization: Bearer <admin_token>
Response = 
   {
    "message": "Activity verified successfully, {
    'id': activty_id,
    'user': 1, 
    'duration': 56, 
    'verification_proof': 'http://localhost:8000/media/activities/IMG_8884_upDTDru.jpg', 
    'status': 'VERIFIED', 
    'location': 'Nairobi',
    'activity_date': '2025-09-07',
    'description': 'went for shopping with friends', 
    'activity': 'Meetup'
    }"
}
