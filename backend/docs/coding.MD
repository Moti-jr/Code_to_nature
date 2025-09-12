
# Coding API Documentation

## API Docs Tested With Postman for Manual Input

---

### **Register Coding Session**

**NB:** Ensure user is logged in and access token is set.

**POST** `http://localhost:8000/api/codingsessions/`

**Body**

```json
{
  "duration": "01:30:00",
  "source": "manual",
  "session_name": "Django Basics"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": 2,
    "session_name": "Django Basics",
    "duration": "01:30:00",
    "source": "manual",
    "status": "locked",
    "created_at": "2025-09-07T17:10:29.123449Z",
    "credits_awarded": 15
  }
}
```

---

### **Edit Coding Session**

**PUT** `http://localhost:8000/api/codingsessions/{sessionid}`

**Body**

```json
{
  "duration": "01:50:00",
  "source": "manual",
  "session_name": "Refactoring Project"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": 2,
    "session_name": "Refactoring Project",
    "duration": "01:50:00",
    "source": "manual",
    "status": "locked",
    "created_at": "2025-09-07T17:10:29.123449Z",
    "credits_awarded": 15
  }
}
```

---

### **Partial Update (PATCH)**

**PATCH** `http://localhost:8000/api/codingsessions/{sessionid}`

**Body**

```json
{
  "duration": "01:20:00",
  "session_name": "Quick Debugging Session"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": 2,
    "session_name": "Quick Debugging Session",
    "duration": "01:20:00",
    "source": "manual",
    "status": "locked",
    "created_at": "2025-09-07T17:10:29.123449Z",
    "credits_awarded": 10
  }
}
```

---

### **Get Coding Sessions**

* **For the authenticated user**
  `GET http://localhost:8000/api/codingsessions/me/`

* **For all users (admin only)**
  `GET http://localhost:8000/api/codingsessions/`

**Sample Response**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": 2,
      "session_name": "Intro to Python",
      "duration": "02:00:00",
      "source": "manual",
      "status": "unlocked",
      "created_at": "2025-09-07T10:00:00Z",
      "credits_awarded": 20
    },
    {
      "id": 2,
      "user": 2,
      "session_name": "Django Basics",
      "duration": "01:30:00",
      "source": "github",
      "status": "locked",
      "created_at": "2025-09-07T12:00:00Z",
      "credits_awarded": 15
    }
  ]
}
```

---

## Locking & Unlocking Sessions

* When a coding session is created, `credits_awarded` are **calculated** but the session is **locked** (`status="locked"`).
* When a user verifies eco-activities, they gain **points\_to\_unlock**.
* The system unlocks the **oldest locked sessions first** by calling `.unlock()`.
* Once unlocked:

  * `status` becomes `"unlocked"`
  * The user can use the credits

---
