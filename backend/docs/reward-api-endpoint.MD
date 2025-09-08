# 🌱 Code-to-Nature Rewards App Endpoints

This document describes the rewards-only API endpoints for the Code To Nature.  
All endpoints require authentication

---
## Rewards Management

### GET `/api/rewards/`

List all available rewards.

**Response:**

```json
[
  {
    "id": 2,
    "name": "Carbon Offset 10kg",
    "description": "Offset 10kg of CO2 through verified carbon reduction projects",
    "cost": 25,
    "category": "environmental",
    "category_display": "Environmental",
    "icon": "",
    "popular": false,
    "created_at": "2025-09-07T07:32:59.694840Z"
  },
  {
    "id": 1,
    "name": "Plant a Tree",
    "description": "We'll plant a real tree in your name in a reforestation project",
    "cost": 50,
    "category": "environmental",
    "category_display": "Environmental",
    "icon": "tree",
    "popular": false,
    "created_at": "2025-09-07T07:32:19.625657Z"
  }
]
```

### GET `/api/rewards/popular/`

List popular rewards.

**Response:**

```json
[
  {
    "id": 2,
    "name": "Eco Coffee Mug",
    "description": "Sustainable bamboo coffee mug with Code-to-Nature branding",
    "cost": 30,
    "category": "merchandise",
    "available": true,
    "category_display": "Merchandise",
    "icon": "coffee",
    "popular": true,
    "created_at": "2025-09-07T21:23:46.844888Z",
    "redemption_count": 0,
    "can_afford": false
  },
  {
    "id": 1,
    "name": "Plant a Tree",
    "description": "We'll plant a real tree in your name in a reforestation project",
    "cost": 50,
    "category": "environmental",
    "available": true,
    "category_display": "Environmental",
    "icon": "tree",
    "popular": true,
    "created_at": "2025-09-07T21:22:44.316704Z",
    "redemption_count": 0,
    "can_afford": false
  }
]
```
---

### GET `/api/rewards/categories/`

List reward categories.

**Response:** List reward categories.

```json
[
  {
    "category": "environmental",
    "display_name": "Environmental",
    "count": 1
  },
  {
    "category": "merchandise",
    "display_name": "Merchandise",
    "count": 2
  },
  {
    "category": "digital",
    "display_name": "Digital",
    "count": 1
  }
]
```

### GET `/api/rewards/affordable/`

Get rewards user can afford

**Response:** Affordable Rewards.

```json
{
  "user_credits": 300,
  "affordable_rewards": [
    {
      "id": 2,
      "name": "Eco Coffee Mug",
      "description": "Sustainable bamboo coffee mug with Code-to-Nature branding",
      "cost": 30,
      "category": "merchandise",
      "available": true,
      "category_display": "Merchandise",
      "icon": "coffee",
      "popular": true,
      "created_at": "2025-09-07T21:23:46.844888Z",
      "redemption_count": 0,
      "can_afford": false
    },
    {
      "id": 3,
      "name": "Eco Water Bottle",
      "description": "Stainless steel water bottle with temperature control",
      "cost": 40,
      "category": "merchandise",
      "available": true,
      "category_display": "Merchandise",
      "icon": "",
      "popular": false,
      "created_at": "2025-09-07T21:24:52.390461Z",
      "redemption_count": 0,
      "can_afford": false
    },
  ]
}
```

---

## Redemption System

### POST `/api/rewards/redeem/`

Redeem a reward.

**Body:**

```json
{
  "reward_id":1
}
```

**Response:** Redeem a reward.

```json
{
  "success": true,
  "message": "Successfully redeemed Plant a Tree",
  "redemption": {
    "id": 1,
    "reward": 1,
    "cost": 50,
    "date": "2025-09-07T21:52:46.107215Z",
    "reward_icon": "tree",
    "reward_name": "Plant a Tree",
    "reward_category": "environmental",
    "username": "blacknight254"
  },
  "remaining_credits": 250
}
```

### GET `/api/rewards/redemptions/`

User's redemption history.

**Response:** User's redemption history.

```json
[
  {
    "id": 2,
    "reward": 4,
    "cost": 60,
    "date": "2025-09-07T21:53:54.532911Z",
    "reward_icon": "speeaker",
    "reward_name": "Bluetooth Speaker",
    "reward_category": "digital",
    "username": "blacknight254"
  },
  {
    "id": 1,
    "reward": 1,
    "cost": 50,
    "date": "2025-09-07T21:52:46.107215Z",
    "reward_icon": "tree",
    "reward_name": "Plant a Tree",
    "reward_category": "environmental",
    "username": "blacknight254"
  }
]
```

### GET `/api/rewards/stats/`

User's reward statistics.

**Response:** User's reward statistics.

```json
{
  "eco_credits": 190,
  "total_redemptions": 2,
  "total_credits_spent": 110,
  "recent_redemptions": [
    {
      "id": 2,
      "reward": 4,
      "cost": 60,
      "date": "2025-09-07T21:53:54.532911Z",
      "reward_icon": "speeaker",
      "reward_name": "Bluetooth Speaker",
      "reward_category": "digital",
      "username": "blacknight254"
    },
    {
      "id": 1,
      "reward": 1,
      "cost": 50,
      "date": "2025-09-07T21:52:46.107215Z",
      "reward_icon": "tree",
      "reward_name": "Plant a Tree",
      "reward_category": "environmental",
      "username": "blacknight254"
    }
  ]
}
```

---

- All endpoints require tenant authentication (`Authorization` header).
- For creation and update endpoints, use `Content-Type: application/json`.
- Responses may include additional fields based
