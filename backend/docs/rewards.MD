# 🌱 Code-to-Nature Rewards App Integration

## Files Created

1. **`rewards/views.py`** - Complete API views for reward management
2. **`rewards/serializers.py`** - DRF serializers for data validation
3. **`rewards/signals.py`** - Django signals for automated actions
4. **`rewards/urls.py`** - URL routing for the rewards app
5. **`rewards/apps.py`** - App configuration with signal integration
6. **`rewards/admin.py`** - Enhanced admin interface

## 🔗 URL Integration

Add this to your main `urls.py`:

```python
# codetonature_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/rewards/', include('apps.rewards.urls')),
    # ... your other URLs
]
```

## 📋 Available Endpoints

### Reward Management
- `GET /api/rewards/` - List all available rewards
- `GET /api/rewards/popular/` - List popular rewards
- `GET /api/rewards/categories/` - List reward categories
- `GET /api/rewards/affordable/` - Get rewards user can afford

### Redemption System
- `POST /api/rewards/redeem/` - Redeem a reward
- `GET /api/rewards/redemptions/` - User's redemption history
- `GET /api/rewards/stats/` - User's reward statistics


## 🧩 Integration Requirements

### UserProfile Model
Create or update your `users/models.py`:

```python
from django.db import models
from django.conf import settings

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    eco_credits = models.PositiveIntegerField(default=0)
    # ... other fields
```

### Settings Configuration

Add to your `settings.py`:

```python

# App registration
INSTALLED_APPS = [
    # ... other apps
    'rewards',
    'rest_framework',
]
```

## 🎯 Key Features

### ✅ Implemented Features
- **Complete CRUD operations** for rewards
- **Secure redemption system** with credit validation
- **User statistics** and redemption history
- **Filtering and categorization** of rewards
- **Automated email notifications** on redemption
- **Milestone tracking** through signals
- **Admin interface** with enhanced features
- **Atomic transactions** for data integrity

### 🚀 API Usage Examples

#### Redeem a Reward
```javascript
POST /api/rewards/redeem/
{
    "reward_id": 1
}
```

#### Get Affordable Rewards
```javascript
GET /api/rewards/affordable/
Response: {
    "user_credits": 150,
    "affordable_rewards": [...]
}
```

#### Filter by Category
```javascript
GET /api/rewards/?category=environmental&popular=true
```

## 🔐 Security Features

- **Authentication required** for all endpoints
- **Atomic transactions** prevent double-spending
- **Input validation** through serializers
- **Permission-based access** control

## 📈 Analytics & Monitoring

The signals system automatically:
- Logs redemption events
- Tracks user milestones
- Updates reward popularity
- Sends confirmation emails
- Monitors credit balances

## 🎨 Frontend Integration

Use these endpoints in your React frontend to:
- Display available rewards in a grid
- Show user's eco-credit balance
- Implement redemption workflow
- Track user achievements
- Filter rewards by category


The reward system is now ready to gamify your Code-to-Nature platform! 🌱💻