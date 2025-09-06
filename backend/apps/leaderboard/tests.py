from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from apps.users.models import Profile
import json

User = get_user_model()

class LeaderboardViewTests(TestCase):
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        
        # Create test users and profiles
        self.users_data = [
            {'username': 'user1', 'email': 'user1@test.com', 'eco_credits': 100},
            {'username': 'user2', 'email': 'user2@test.com', 'eco_credits': 85},
            {'username': 'user3', 'email': 'user3@test.com', 'eco_credits': 95},
            {'username': 'user4', 'email': 'user4@test.com', 'eco_credits': 70},
            {'username': 'user5', 'email': 'user5@test.com', 'eco_credits': 120},
        ]
        
        self.profiles = []
        for user_data in self.users_data:
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password='testpass123'
            )
            profile = Profile.objects.create(
                user=user,
                eco_credits=user_data['eco_credits'],
                github_username=f"github_{user_data['username']}",
                current_streak=5,
                longest_streak=10
            )
            self.profiles.append(profile)

    def test_top_eco_credits_endpoint(self):
        """Test the top eco credits endpoint"""
        url = reverse('leaderboard:top_eco_credits')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.content)
        self.assertTrue(data['success'])
        self.assertIn('data', data)
        
        # Should return users ordered by eco_credits descending
        leaderboard = data['data']
        self.assertEqual(len(leaderboard), 5)  # All 5 users
        
        # Check if properly ordered
        self.assertEqual(leaderboard[0]['eco_credits'], 120)  # user5
        self.assertEqual(leaderboard[1]['eco_credits'], 100)  # user1
        self.assertEqual(leaderboard[2]['eco_credits'], 95)   # user3
        self.assertEqual(leaderboard[3]['eco_credits'], 85)   # user2
        self.assertEqual(leaderboard[4]['eco_credits'], 70)   # user4
        
        # Check rank assignment
        for i, user in enumerate(leaderboard):
            self.assertEqual(user['rank'], i + 1)

    def test_top_eco_credits_limit_10(self):
        """Test that endpoint returns maximum 10 users"""
        # Create additional users to test the limit
        for i in range(6, 16):  # Create 10 more users
            user = User.objects.create_user(
                username=f'user{i}',
                email=f'user{i}@test.com',
                password='testpass123'
            )
            Profile.objects.create(
                user=user,
                eco_credits=50 + i,  # Varying eco_credits
                github_username=f"github_user{i}"
            )
        
        url = reverse('leaderboard:top_eco_credits')
        response = self.client.get(url)
        
        data = json.loads(response.content)
        leaderboard = data['data']
        
        # Should return maximum 10 users
        self.assertEqual(len(leaderboard), 10)

    def test_leaderboard_with_friends_endpoint(self):
        """Test the enhanced leaderboard endpoint"""
        # Add some friendships
        self.profiles[0].friends.add(self.profiles[1], self.profiles[2])
        
        url = reverse('leaderboard:leaderboard_with_friends')
        response = self.client.get(url, {'user_id': self.profiles[0].user.id, 'limit': 5})
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.content)
        self.assertTrue(data['success'])
        self.assertIn('data', data)
        
        leaderboard_data = data['data']
        self.assertIn('leaderboard', leaderboard_data)
        self.assertIn('user_position', leaderboard_data)
        self.assertIn('friends_positions', leaderboard_data)

    def test_empty_leaderboard(self):
        """Test leaderboard when no profiles exist"""
        # Delete all profiles
        Profile.objects.all().delete()
        
        url = reverse('leaderboard:top_eco_credits')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.content)
        self.assertTrue(data['success'])
        self.assertEqual(len(data['data']), 0)
