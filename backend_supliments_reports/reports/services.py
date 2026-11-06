from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Avg
from .models import (
    DailyHealthLog,
    ReportGoal,
    ReportAreaOfImprovement,
    ReportAIInsight,
    RecentActivity,
)

def format_day(d):
    """Cross-platform day formatting (e.g. '4 Jun')"""
    return f"{d.day} {d.strftime('%b')}"

def format_day_year(d):
    """Cross-platform day-year formatting (e.g. '4 Jun 2025')"""
    return f"{d.day} {d.strftime('%b %Y')}"

class AnalyticsService:
    @staticmethod
    def get_date_range(period='7d'):
        today = timezone.localdate()
        if period == '30d':
            days = 30
        elif period == '3m':
            days = 90
        elif period == '1y':
            days = 365
        else:
            days = 7
        start_date = today - timedelta(days=days - 1)
        prev_start_date = start_date - timedelta(days=days)
        prev_end_date = start_date - timedelta(days=1)
        return start_date, today, prev_start_date, prev_end_date, days

    @classmethod
    def generate_report(cls, user, period='7d', tab='overview'):
        start_date, end_date, prev_start_date, prev_end_date, days = cls.get_date_range(period)

        # Retrieve user logs in range
        logs = DailyHealthLog.objects.filter(
            user=user,
            date__range=[start_date, end_date]
        ).order_by('date')

        # Previous period logs for trend calculations (+8%, etc.)
        prev_logs = DailyHealthLog.objects.filter(
            user=user,
            date__range=[prev_start_date, prev_end_date]
        )

        # Fallback dummy data generation if user is brand new and has no logs yet
        if not logs.exists():
            cls._seed_starter_logs(user, start_date, days)
            logs = DailyHealthLog.objects.filter(
                user=user,
                date__range=[start_date, end_date]
            ).order_by('date')

        # Compute Aggregates
        total_calories = sum(log.calories_consumed for log in logs)
        total_burned = sum(log.calories_burned for log in logs)
        total_protein = sum(float(log.protein_g) for log in logs)
        total_carbs = sum(float(log.carbs_g) for log in logs)
        total_fat = sum(float(log.fat_g) for log in logs)
        total_water = sum(float(log.water_liters) for log in logs)
        avg_water = round(total_water / max(len(logs), 1), 1)
        total_workouts = sum(log.workout_sessions_count for log in logs)

        prev_calories = sum(log.calories_consumed for log in prev_logs) or 12800
        prev_protein = sum(float(log.protein_g) for log in prev_logs) or 820
        prev_water = (sum(float(log.water_liters) for log in prev_logs) / max(len(prev_logs), 1)) if prev_logs.exists() else 2.8
        prev_workouts = sum(log.workout_sessions_count for log in prev_logs) or 5

        # Changes vs previous period
        cal_change = int(((total_calories - prev_calories) / prev_calories) * 100) if prev_calories else 8
        protein_change = int(((total_protein - prev_protein) / prev_protein) * 100) if prev_protein else 12
        water_change = int(((avg_water - prev_water) / prev_water) * 100) if prev_water else -10
        workout_change = int(((total_workouts - prev_workouts) / prev_workouts) * 100) if prev_workouts else 20

        # Sparklines
        cal_sparkline = [log.calories_consumed for log in logs][-7:]
        protein_sparkline = [int(log.protein_g) for log in logs][-7:]
        water_sparkline = [float(log.water_liters) for log in logs][-7:]
        workout_sparkline = [log.workout_sessions_count * 10 for log in logs][-7:]

        # KPI Metrics
        kpi_metrics = [
            {
                'id': 'kpi-calories',
                'title': 'Calories',
                'value': f"{total_calories:,}",
                'target': '15,400 kcal',
                'change': f"{'+' if cal_change >= 0 else ''}{cal_change}%",
                'isPositive': cal_change >= 0,
                'comparisonText': 'vs previous period',
                'type': 'calories',
                'sparklineData': cal_sparkline or [40, 55, 48, 65, 58, 80, 88],
            },
            {
                'id': 'kpi-protein',
                'title': 'Protein',
                'value': f"{int(total_protein):,}",
                'target': '1,050 g',
                'change': f"{'+' if protein_change >= 0 else ''}{protein_change}%",
                'isPositive': protein_change >= 0,
                'comparisonText': 'vs previous period',
                'type': 'protein',
                'sparklineData': protein_sparkline or [50, 62, 58, 70, 68, 85, 92],
            },
            {
                'id': 'kpi-water',
                'title': 'Water',
                'value': str(avg_water),
                'target': '4 L',
                'change': f"{'+' if water_change >= 0 else ''}{water_change}%",
                'isPositive': water_change >= 0,
                'comparisonText': 'vs previous period',
                'type': 'water',
                'sparklineData': water_sparkline or [85, 80, 75, 70, 65, 60, 55],
            },
            {
                'id': 'kpi-workouts',
                'title': 'Workouts',
                'value': str(total_workouts),
                'target': '8 sessions',
                'change': f"{'+' if workout_change >= 0 else ''}{workout_change}%",
                'isPositive': workout_change >= 0,
                'comparisonText': 'vs previous period',
                'type': 'workouts',
                'sparklineData': workout_sparkline or [30, 45, 40, 60, 70, 75, 90],
            },
        ]

        # Calorie intake vs burn chart
        calorie_intake_vs_burn = [
            {
                'day': format_day(log.date),
                'intake': log.calories_consumed,
                'burned': log.calories_burned,
            }
            for log in logs
        ]

        # Macronutrients
        total_macro_g = (total_carbs + total_protein + total_fat) or 1
        carbs_pct = round((total_carbs / total_macro_g) * 100)
        protein_pct = round((total_protein / total_macro_g) * 100)
        fat_pct = 100 - (carbs_pct + protein_pct)

        macronutrient_distribution = {
            'totalCalories': f"{total_calories:,}",
            'items': [
                {'name': 'Carbohydrates', 'percentage': carbs_pct or 45, 'amount': f"{int(total_carbs // max(len(logs), 1))}g", 'color': '#2BAF34'},
                {'name': 'Protein', 'percentage': protein_pct or 29, 'amount': f"{int(total_protein // max(len(logs), 1))}g", 'color': '#F59E0B'},
                {'name': 'Fats', 'percentage': fat_pct or 26, 'amount': f"{int(total_fat // max(len(logs), 1))}g", 'color': '#3B82F6'},
            ]
        }

        # Weight Progress
        weight_logs = [log for log in logs if log.weight_kg is not None]
        current_weight = weight_logs[-1].weight_kg if weight_logs else 82.4
        first_weight = weight_logs[0].weight_kg if weight_logs else 83.6
        diff = round(float(current_weight) - float(first_weight), 1)

        weight_progress = {
            'currentWeight': f"{current_weight} kg",
            'change': f"{'+' if diff >= 0 else ''}{diff} kg",
            'comparison': 'vs last month',
            'data': [
                {
                    'day': format_day(log.date),
                    'weight': float(log.weight_kg)
                }
                for log in weight_logs
            ]
        }

        # Body Composition
        body_composition = [
            {
                'day': format_day(log.date),
                'muscle': float(log.muscle_mass_pct or 48.0),
                'fat': float(log.body_fat_pct or 21.0),
                'water': float(log.water_pct or 60.0),
            }
            for log in logs
        ]

        # Top Performing Days
        sorted_by_cals = sorted(logs, key=lambda x: x.calories_consumed, reverse=True)[:3]
        top_performing_days = [
            {
                'date': format_day_year(log.date),
                'percentage': 90,
                'calories': f"{log.calories_consumed:,} kcal",
                'protein': f"{int(log.protein_g)} g protein",
                'extra': f"{log.workout_summary or 'Workout completed'}",
            }
            for log in sorted_by_cals
        ]

        # Areas for Improvement
        db_improvements = ReportAreaOfImprovement.objects.filter(user=user, is_resolved=False)
        if db_improvements.exists():
            areas_for_improvement = [
                {
                    'id': f'imp-{imp.id}',
                    'title': imp.title,
                    'description': imp.description,
                    'icon': imp.icon
                }
                for imp in db_improvements
            ]
        else:
            areas_for_improvement = [
                {'id': 'imp-1', 'title': 'Increase Water Intake', 'description': 'Try to reach 4L daily for better recovery.', 'icon': 'water'},
                {'id': 'imp-2', 'title': 'Improve Sleep Consistency', 'description': 'Your average sleep is 6.2 hrs. Aim for 7-8 hrs.', 'icon': 'sleep'},
                {'id': 'imp-3', 'title': 'More Strength Workouts', 'description': 'Add 1-2 more strength sessions per week.', 'icon': 'strength'},
            ]

        # Summary
        report_summary = [
            {'label': 'Avg. Daily Calories', 'value': f"{int(total_calories / max(len(logs), 1)):,} kcal", 'change': f"{'+' if cal_change >= 0 else ''}{cal_change}%", 'positive': cal_change >= 0},
            {'label': 'Avg. Daily Protein', 'value': f"{int(total_protein / max(len(logs), 1))} g", 'change': f"{'+' if protein_change >= 0 else ''}{protein_change}%", 'positive': protein_change >= 0},
            {'label': 'Avg. Daily Water', 'value': f"{avg_water} L", 'change': f"{'+' if water_change >= 0 else ''}{water_change}%", 'positive': water_change >= 0},
            {'label': 'Total Workouts', 'value': f"{total_workouts} sessions", 'change': f"{'+' if workout_change >= 0 else ''}{workout_change}%", 'positive': workout_change >= 0},
        ]

        # Goals
        db_goals = ReportGoal.objects.filter(user=user)
        if db_goals.exists():
            report_goals = [
                {
                    'title': g.title,
                    'current': g.current_value,
                    'target': g.target_value,
                    'percentage': g.percentage,
                    'color': g.color
                }
                for g in db_goals
            ]
        else:
            report_goals = [
                {'title': 'Weight Goal', 'current': f"{current_weight} kg", 'target': '65 kg', 'percentage': 85, 'color': '#2BAF34'},
                {'title': 'Protein Goal', 'current': f"{int(total_protein / max(len(logs), 1))} g", 'target': '150 g', 'percentage': 88, 'color': '#2BAF34'},
                {'title': 'Water Goal', 'current': f"{avg_water} L", 'target': '4 L', 'percentage': 60, 'color': '#3B82F6'},
                {'title': 'Workout Goal', 'current': str(total_workouts), 'target': '8 sessions', 'percentage': 75, 'color': '#8B5CF6'},
            ]

        # Recent Activity
        db_activities = RecentActivity.objects.filter(user=user)[:5]
        if db_activities.exists():
            recent_activity = [
                {
                    'title': act.title,
                    'meta': act.meta,
                    'date': format_day_year(act.date),
                    'icon': act.icon
                }
                for act in db_activities
            ]
        else:
            recent_activity = [
                {'title': 'Push Day', 'meta': '1h 15m', 'date': format_day_year(end_date), 'icon': 'workout'},
                {'title': 'Water Intake', 'meta': f'{avg_water} L', 'date': format_day_year(end_date), 'icon': 'water'},
                {'title': 'High Protein Breakfast', 'meta': '420 kcal', 'date': format_day_year(end_date), 'icon': 'food'},
            ]

        # AI Insight
        insight = ReportAIInsight.objects.filter(user=user).first()
        ai_insight = {
            'title': insight.title if insight else 'AI Performance Report',
            'headline': insight.headline if insight else 'Consistency is up 18.4% this week',
            'description': insight.description if insight else 'You hit 6 out of 8 planned workout sessions with optimal macronutrient balance.',
        }

        return {
            'period': period,
            'date_range': f"{format_day_year(start_date)} - {format_day_year(end_date)}",
            'ai_insight': ai_insight,
            'kpi_metrics': kpi_metrics,
            'calorie_intake_vs_burn': calorie_intake_vs_burn,
            'macronutrient_distribution': macronutrient_distribution,
            'weight_progress': weight_progress,
            'body_composition': body_composition,
            'top_performing_days': top_performing_days,
            'areas_for_improvement': areas_for_improvement,
            'report_summary': report_summary,
            'report_goals': report_goals,
            'recent_activity': recent_activity,
        }

    @staticmethod
    def _seed_starter_logs(user, start_date, count=7):
        """Creates realistic health logs for initial user onboarding"""
        import random
        base_weight = 83.6
        created_logs = []
        for i in range(count):
            d = start_date + timedelta(days=i)
            weight = round(base_weight - (i * 0.18), 1)
            cals = 1900 + (i * 35) + random.randint(-40, 40)
            burned = 1750 + (i * 20) + random.randint(-30, 30)
            protein = 130 + (i * 2)
            carbs = 210 + (i * 2)
            fat = 55 + (i % 3)
            water = round(2.3 + (i * 0.05), 2)
            muscle = round(48.0 + (i * 0.4), 1)
            fat_pct = round(22.0 - (i * 0.25), 1)
            water_pct = round(58.0 + (i * 0.5), 1)
            
            created_logs.append(DailyHealthLog(
                user=user,
                date=d,
                calories_consumed=cals,
                calories_burned=burned,
                protein_g=protein,
                carbs_g=carbs,
                fat_g=fat,
                water_liters=water,
                weight_kg=weight,
                muscle_mass_pct=muscle,
                body_fat_pct=fat_pct,
                water_pct=water_pct,
                sleep_hours=7.2,
                workout_sessions_count=1 if i in (0, 1, 3, 4, 6) else 0,
                workout_duration_minutes=65 if i in (0, 1, 3, 4, 6) else 0,
                workout_summary='Push Day' if i % 2 == 0 else 'Pull Day',
            ))
        DailyHealthLog.objects.bulk_create(created_logs, ignore_conflicts=True)
