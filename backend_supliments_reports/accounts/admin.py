from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'email', 'username', 'first_name', 'last_name', 'is_staff', 'is_verified')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('id',)

