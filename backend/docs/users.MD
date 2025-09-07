# Users App Documentation

## API Docs Tested With PostMan
***Signup user***
POST https://localhost/api/users/
body
{
  "email": "johndoe@example.com",
  "password": "test12345"
}

response
{
  "success": true,
  "data": {
    "email": "johndoe@example.com",
    "username": "johndoe"
  }
}

***Login user***
POST https://localhost/api/token/
body
{
  "email": "johndoe@example.com",
  "password": "test12345"
}

response: {
  refresh: "....",
  access: "....",
}
copy access token and set postman authorization type to Bearer Token
![Postman Bearer Token Example](screenshots/tokenexample.jpeg)

Note: Access token is required for all authenticated endpoints

***Get User(s)***
Make sure that access token is set in headers
GET https://localhost/api/users/ (admin route only)
GET https://localhost/api/users/{id}/

***User Profile***
User Profile is created when user is first created
Make sure that access token is set in headers
GET https://localhost/api/profiles/ (admin route only)
GET https://localhost/api/profiles/{id}/

response
{
  "success": true,
    "data": {
    "user": {id},
    "profile_pic": null,
    "github_username": "",
    "github_token": null,
    "eco_credits": 0,
    "locked_credits": 0,
    "current_streak": 0,
    "longest_streak": 0,
    "friends": []
  }
}

***Edit Profile***
All fields
PUT https://localhost/api/profiles/{id}/
body
{
  "profile_pic": null,
  "github_username": "newgithubuser",
  "github_token": null,
  "eco_credits": 10,
  "locked_credits": 5,
  "current_streak": 2,
  "longest_streak": 7,
  "friends": []
}

response
{
  "success": true,
  "data": {
    "user": {id},
    "profile_pic": null,
    "github_username": "newgithubuser",
    "github_token": null,
    "eco_credits": 10,
    "locked_credits": 5,
    "current_streak": 2,
    "longest_streak": 7,
    "friends": []
  }
}

edit select fields
PATCH https://localhost/api/profiles/{id}/
body
{
  "github_username": "updatedgithub"
}

response
{
  "success": true,
  "data": {
    "user": {id},
    "profile_pic": null,
    "github_username": "updatedgithub",
    "github_token": null,
    "eco_credits": 10,
    "locked_credits": 5,
    "current_streak": 2,
    "longest_streak": 7,
    "friends": []
  }
}
