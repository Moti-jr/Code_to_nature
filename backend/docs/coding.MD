# Coding API Documentation

## API Docs Tested With Postman for Manual Input
***Register coding session**
NB: Ensure User is logged in and access token is set
POST http://localhost:8000/api/codingsessions/
Body
{
  "user": {id}, # replace with actual user id
  "duration": "01:30:00",
  "source": "manual"
}
Response
{
    "success": true,
    "data": {
        "user": {id},
        "duration": "01:30:00",
        "source": "manual",
        "created_at": "2025-09-07T17:10:29.123449Z",
        "credits_awarded": 15
    }
}

***Edit Coding Session***
PUT http://localhost:8000/api/codingsessions/{sessionid}
Body
{
  "user": {id}, # replace with actual user id
  "duration": "01:30:00",
  "source": "manual"
}
Response
{
    "success": true,
    "data": {
        "user": {id},
        "duration": "01:50:00",
        "source": "manual",
        "created_at": "2025-09-07T17:10:29.123449Z",
        "credits_awarded": 15
    }
}

PATCH http://localhost:8000/api/codingsessions/{sessionid}
Body
{
  "duration": "01:20:00"
}

Response
{
    "success": true,
    "data": {
        "user": {id},
        "duration": "01:20:00",
        "source": "manual",
        "created_at": "2025-09-07T17:10:29.123449Z",
        "credits_awarded": 10
    }
}

***Get coding sessions***
For specific user
GET http://localhost:8000/api/codingsessions/?user={user_id}
For all users
GET http://localhost:8000/api/codingsessions/

## Running Celery for GitHub Auto Coding Session (Development)

To test automatic GitHub coding session creation in development:

1. **Start Redis** (if not already running):
   - On Mac (with Homebrew):
     ```sh
     brew services start redis
     ```
   - Or run in foreground:
     ```sh
     redis-server
     ```

2. **Start the Celery worker** (in your project root, where manage.py is):
   ```sh
   celery -A codetonature_project worker --loglevel=info
   ```

3. **Start Celery beat** (in a separate terminal, same directory):
   ```sh
   celery -A codetonature_project beat --loglevel=info
   ```
   This will schedule the GitHub auto-update task (every minute if configured for testing).

4. **Check your Celery worker terminal** for output like:
   ```
   Checking profile id with githubuser
   Created session for 1
   ```
   This means the auto GitHub session creation is working.

5. **Make sure you have at least one profile with a non-empty github_username** in your database.

6. **You can also trigger the task manually in Django shell:**
   ```sh
   python manage.py shell
   ```
   ```python
   from apps.coding.tasks import create_daily_github_coding_session
   create_daily_github_coding_session.delay()
   ```
