from django.contrib import admin
from .models import (
    SupplementCategory,
    SupplementProduct,
    UserSupplementStack,
    SupplementReminder,
    SupplementDailyLog,
    SupplementGoal,
    SupplementWishlist,
    SupplementCartItem,
    SupplementArticle,
)

@admin.register(SupplementCategory)
class SupplementCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'display_order')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(SupplementProduct)
class SupplementProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'original_price', 'rating', 'in_stock', 'is_featured')
    list_filter = ('category', 'in_stock', 'is_featured')
    search_fields = ('name', 'brand', 'description')

@admin.register(UserSupplementStack)
class UserSupplementStackAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'category', 'dosage', 'timing', 'status', 'start_date')
    list_filter = ('status', 'timing', 'category')
    search_fields = ('name', 'user__username', 'user__email')

@admin.register(SupplementReminder)
class SupplementReminderAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'dose', 'time', 'is_enabled')
    list_filter = ('is_enabled',)

@admin.register(SupplementDailyLog)
class SupplementDailyLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'stack_item', 'date', 'is_taken', 'taken_at')
    list_filter = ('date', 'is_taken')

@admin.register(SupplementGoal)
class SupplementGoalAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'percentage', 'color')

@admin.register(SupplementArticle)
class SupplementArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'published_date', 'is_published')
    list_filter = ('is_published', 'published_date')

admin.site.register(SupplementWishlist)
admin.site.register(SupplementCartItem)

