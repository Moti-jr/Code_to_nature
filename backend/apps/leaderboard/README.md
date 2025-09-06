# Leaderboard App

The Leaderboard app provides endpoints to rank users by their eco_credits and enable competitive wellness scoring among friends and colleagues.

## Features

- **Top 10 Eco Credits**: Get the top-performing users ranked by eco_credits
- **Friends Competition**: Enhanced leaderboard showing user position and friend rankings
- **JSON API**: RESTful endpoints returning structured JSON data

## Endpoints

### 1. Top Eco Credits Leaderboard

**Endpoint**: `GET /api/leaderboard/top-eco-credits/`

Returns the top 10 users ranked by eco_credits in descending order.

**Response Format**:
```json
{
    "success": true,
    "data": [
        {
            "rank": 1,
            "username": "user123",
            "eco_credits": 150,
            "current_streak": 7,
            "longest_streak": 15,
            "github_username": "github_user123"
        },
        ...
    ],
    "total_users": 10
}
```

### 2. Enhanced Leaderboard with Friends

**Endpoint**: `GET /api/leaderboard/friends/`

Returns leaderboard with user position and friends' rankings.

**Query Parameters**:
- `user_id` (optional): ID of the user to find their position and friends
- `limit` (optional): Number of top users to return (default: 10)

**Example**: `/api/leaderboard/friends/?user_id=5&limit=5`

**Response Format**:
```json
{
    "success": true,
    "data": {
        "leaderboard": [
            {
                "rank": 1,
                "user_id": 3,
                "username": "topuser",
                "eco_credits": 200,
                "current_streak": 10,
                "longest_streak": 20,
                "github_username": "github_topuser"
            },
            ...
        ],
        "user_position": {
            "rank": 15,
            "user_id": 5,
            "username": "currentuser",
            "eco_credits": 85,
            "current_streak": 3,
            "longest_streak": 12,
            "github_username": "github_currentuser"
        },
        "friends_positions": [
            {
                "rank": 8,
                "user_id": 7,
                "username": "friend1",
                "eco_credits": 110,
                "current_streak": 5,
                "longest_streak": 18,
                "github_username": "github_friend1"
            },
            ...
        ],
        "total_users_shown": 5
    }
}
```

## Data Model

The leaderboard queries the `Profile` model from the `users` app, which includes:

- `eco_credits`: Primary ranking metric
- `current_streak`: Current activity streak
- `longest_streak`: Longest streak achieved
- `github_username`: GitHub profile identifier
- `friends`: Many-to-many relationship for friend connections

## Usage Examples

### Simple Top 10 Request
```bash
curl http://localhost:8000/api/leaderboard/top-eco-credits/
```

### Get User Position and Friends
```bash
curl "http://localhost:8000/api/leaderboard/friends/?user_id=5&limit=10"
```

## Testing

Run the test suite with:
```bash
python manage.py test apps.leaderboard.tests
```

## Error Handling

All endpoints return structured error responses:
```json
{
    "success": false,
    "error": "Error message description"
}
```

## Performance Considerations

- Uses `select_related()` to optimize database queries
- Limits results to prevent excessive data transfer
- Efficient ranking calculation using Django ORM aggregation
