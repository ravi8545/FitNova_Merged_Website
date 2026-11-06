from django.contrib import admin
from .models import (
    DailyHealthLog,
    ReportGoal,
    ReportAreaOfImprovement,
    ReportAIInsight,
    RecentActivity,
)

@admin.register(DailyHealthLog)
class DailyHealthLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'calories_consumed', 'calories_burned', 'protein_g', 'water_liters', 'weight_kg')
    list_filter = ('date',)
    search_fields = ('user__username', 'user__email')

@admin.register(ReportGoal)
class ReportGoalAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'current_value', 'target_value', 'percentage')

@admin.register(ReportAreaOfImprovement)
class ReportAreaOfImprovementAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'icon', 'is_resolved')
    list_filter = ('is_resolved', 'icon')

@admin.register(ReportAIInsight)
class ReportAIInsightAdmin(admin.ModelAdmin):
    list_display = ('user', 'headline', 'generated_for_date', 'created_at')

@admin.register(RecentActivity)
class RecentActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'meta', 'date', 'icon')
    list_filter = ('icon', 'date')

