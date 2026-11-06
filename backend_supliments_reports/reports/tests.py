from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from reports.models import DailyHealthLog, ReportGoal

User = get_user_model()

class ReportsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='athlete_reports',
            email='reporter@fitnova.com',
            password='Password123!'
        )
        self.client.force_authenticate(user=self.user)

        # Seed sample log
        DailyHealthLog.objects.create(
            user=self.user,
            date=date.today(),
            calories_consumed=2100,
            calories_burned=1850,
            protein_g=145.0,
            carbs_g=220.0,
            fat_g=60.0,
            water_liters=3.5,
            weight_kg=82.4,
            muscle_mass_pct=50.5,
            body_fat_pct=20.8,
            water_pct=61.0,
            sleep_hours=7.5,
            workout_sessions_count=1,
            workout_summary='Push Day'
        )

    def test_analytics_report_endpoint(self):
        response = self.client.get('/api/reports/analytics/?period=7d')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify all frontend required keys exist
        expected_keys = [
            'period',
            'date_range',
            'ai_insight',
            'kpi_metrics',
            'calorie_intake_vs_burn',
            'macronutrient_distribution',
            'weight_progress',
            'body_composition',
            'top_performing_days',
            'areas_for_improvement',
            'report_summary',
            'report_goals',
            'recent_activity'
        ]
        for key in expected_keys:
            self.assertIn(key, response.data, f"Key '{key}' missing from analytics response")

        # Verify KPI metrics format
        self.assertEqual(len(response.data['kpi_metrics']), 4)
        calories_kpi = response.data['kpi_metrics'][0]
        self.assertEqual(calories_kpi['id'], 'kpi-calories')
        self.assertIn('sparklineData', calories_kpi)

    def test_create_daily_health_log(self):
        payload = {
            'date': '2026-11-01',
            'calories_consumed': 2000,
            'calories_burned': 1800,
            'protein_g': 135.0,
            'carbs_g': 210.0,
            'fat_g': 55.0,
            'water_liters': 3.0,
            'weight_kg': 82.5,
            'workout_sessions_count': 1,
            'workout_summary': 'Leg Day'
        }
        response = self.client.post('/api/reports/logs/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DailyHealthLog.objects.filter(user=self.user, date='2026-11-01').count(), 1)

    def test_create_report_goal(self):
        payload = {
            'title': 'Target Weight',
            'current_value': '82.4 kg',
            'target_value': '78 kg',
            'percentage': 60,
            'color': '#2BAF34'
        }
        response = self.client.post('/api/reports/goals/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReportGoal.objects.filter(user=self.user, title='Target Weight').count(), 1)

