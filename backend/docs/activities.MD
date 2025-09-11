## Activities app
App enables users to create activities as evidence of them performing the outdoor activity.
Once the activity is  verified by the admin of the system, the users locked credits become eco_credits based on the duration 
of their activity.


## Features
Activity creation and update for the custom user.
Activity verification by admin
Conversion of Locked credits to Eco_credits


## Endpoints
1. Creation and update of activity  : 

**Permissions:**  
- Requires IsAuthenticated (only registered accounts can call this action).  
- Pass token in Authorization header to perform request

POST request to f{base_url}/api/activities/
content-type : application/json
Payload:
  
{
    "duration": "4:0:0",
    "verification_proof": .png,
    "location": "",
    "activity_date": 2025-09-07,
    "description": "",
    "activity": "hiking"
    
}


Response:

{
    "success": true,
    "data": {
    "id": 9,
    "user": 1,
    "duration": "4:0:0",
    "verification_proof": "http://localhost:8000/media/activities/IMG_0329.JPG",
    "status": "PENDING",
    "location": null,
    "activity_date": "2025-09-07",
    "description": null,
    "activity": "hiking"
    }
}

2. Verifying activity
POST /api/activities/{id}/verify_activity/

**Permissions:**  
- Requires IsAdminUser (only staff/superuser accounts can call this action).  
- Non-admin users will receive a 403 Forbidden.

**Request Example (as admin):**
POST /api/activities/1/verify_activity/
Authorization: Bearer <admin_token>
Response = 
 
{
    "success": true,
    "data": {
    'id': activty_id,
    'user': 1, 
    'duration': "4:0:0", 
    'verification_proof': 'http://localhost:8000/media/activities/IMG_8884_upDTDru.jpg', 
    'status': 'VERIFIED', 
    'location': 'Nairobi',
    'activity_date': '2025-09-07',
    'description': 'hiking', 
    'activity': 'hiking'
    }"
}
ChatGPT said:

**Activities App**
The Activities App allows users to create and log outdoor activities as evidence of participation.
Once submitted, activities are reviewed and verified by an admin.
Verified activities automatically convert locked credits into eco_credits, based on the activity duration.

🚀 Features

✅ Users can create and update their activities.

🔒 Activities remain pending until verified by an admin.

🌱 Verified activities unlock eco_credits based on the activity duration.

📡 API Endpoints
1. Create or Update Activity

## Endpoint:
POST {base_url}/api/activities/
**Permissions**:
   Requires IsAuthenticated (only logged-in users).
   Token must be provided in the Authorization header.

Request Headers
  Authorization: Bearer <user_token>

  Payload:
  ```
{
  "duration": "4:00:00",
  "verification_proof": "activity.png",
  "location": "Nairobi",
  "activity_date": "2025-09-07",
  "description": "Morning hike at Karura",
  "activity": "hiking"
}

  ```
Response Example
```
  {
  "success": true,
  "data": {
    "id": 9,
    "user": 1,
    "duration": "4:00:00",
    "verification_proof": "http://localhost:8000/media/activities/IMG_0329.JPG",
    "status": "PENDING",
    "location": "Nairobi",
    "activity_date": "2025-09-07",
    "description": "Morning hike at Karura",
    "activity": "hiking"
  }
}


```

2. Verifying activity
`POST /api/activities/{id}/verify_activity/`

**Permissions:**  
- Requires `IsAdminUser` (only staff/superuser accounts can call this action).  
- Non-admin users will receive a `403 Forbidden`.

**Request Example (as admin):**
POST `/api/activities/1/verify_activity/`
Authorization: Bearer <admin_token>
Response = 
 ```
{
  "success": true,
  "data": {
    "id": 1,
    "user": 1,
    "duration": "4:00:00",
    "verification_proof": "http://localhost:8000/media/activities/IMG_8884_upDTDru.jpg",
    "status": "VERIFIED",
    "location": "Nairobi",
    "activity_date": "2025-09-07",
    "description": "Morning hike at Karura",
    "activity": "hiking"
  }
}

```
📝 Notes

-Activities remain PENDING until an admin verifies them.
-Only admins can verify activities and trigger the conversion of locked credits into eco_credits.
-The activity field must match one of the predefined activity choices (e.g., hiking, cycling, etc.).
