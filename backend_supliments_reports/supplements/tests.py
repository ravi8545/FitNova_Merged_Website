from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from supplements.models import (
    SupplementCategory,
    SupplementProduct,
    UserSupplementStack,
    SupplementReminder,
    SupplementGoal,
)

User = get_user_model()

class SupplementsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='athlete_supp',
            email='athlete@fitnova.com',
            password='Password123!'
        )
        self.client.force_authenticate(user=self.user)

        self.category = SupplementCategory.objects.create(
            slug='protein',
            name='Protein',
            description='Build & repair muscle'
        )

        self.product = SupplementProduct.objects.create(
            name='Gold Standard Whey',
            slug='gold-standard-whey',
            category=self.category,
            brand='Optimum Nutrition',
            price=5499.00,
            original_price=6999.00,
            rating=4.8,
            reviews_count='12.4k',
            in_stock=True
        )

    def test_list_categories(self):
        response = self.client.get('/api/supplements/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results'] if 'results' in response.data else response.data), 1)

    def test_list_products(self):
        response = self.client.get('/api/supplements/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_to_user_stack(self):
        payload = {
            'name': 'Creatine Monohydrate',
            'category': 'Creatine',
            'dosage': '5 g',
            'timing': 'Post Workout',
            'status': 'Active'
        }
        response = self.client.post('/api/supplements/stack/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserSupplementStack.objects.filter(user=self.user).count(), 1)
        self.assertEqual(response.data['name'], 'Creatine Monohydrate')

    def test_supplement_reminder_toggle(self):
        reminder = SupplementReminder.objects.create(
            user=self.user,
            name='Whey Protein',
            dose='1 scoop',
            time='09:00 AM',
            is_enabled=True
        )
        response = self.client.post(f'/api/supplements/reminders/{reminder.id}/toggle/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        reminder.refresh_from_db()
        self.assertFalse(reminder.is_enabled)

    def test_supplement_overview_endpoint(self):
        UserSupplementStack.objects.create(
            user=self.user,
            name='Omega 3',
            dosage='1 softgel',
            status='Active'
        )
        SupplementGoal.objects.create(
            user=self.user,
            title='Muscle Gain Support',
            percentage=80
        )
        response = self.client.get('/api/supplements/overview/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('overview', response.data)
        self.assertIn('goals', response.data)
        self.assertGreaterEqual(response.data['overview']['activeCount'], 1)

