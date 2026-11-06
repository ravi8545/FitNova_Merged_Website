from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AccountsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='fituser',
            email='fituser@fitnova.com',
            password='Password123!',
            first_name='Fit',
            last_name='User'
        )

    def test_user_registration(self):
        payload = {
            'username': 'newuser',
            'email': 'newuser@fitnova.com',
            'password': 'SecurePassword123!',
            'first_name': 'New',
            'last_name': 'Athlete'
        }
        response = self.client.post('/api/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.filter(email='newuser@fitnova.com').count(), 1)

    def test_jwt_login(self):
        payload = {
            'email': 'fituser@fitnova.com',
            'password': 'Password123!'
        }
        response = self.client.post('/api/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], 'fituser@fitnova.com')

