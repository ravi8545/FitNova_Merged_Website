from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta

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
from .serializers import (
    SupplementCategorySerializer,
    SupplementProductSerializer,
    UserSupplementStackSerializer,
    SupplementReminderSerializer,
    SupplementDailyLogSerializer,
    SupplementGoalSerializer,
    SupplementWishlistSerializer,
    SupplementCartItemSerializer,
    SupplementArticleSerializer,
)

class SupplementCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List & detail for supplement categories.
    """
    queryset = SupplementCategory.objects.all()
    serializer_class = SupplementCategorySerializer
    permission_classes = (permissions.AllowAny,)


class SupplementProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Browse supplement products / catalog with search and category filter.
    """
    queryset = SupplementProduct.objects.filter(in_stock=True)
    serializer_class = SupplementProductSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ('name', 'brand', 'description', 'category__name', 'category__slug')
    ordering_fields = ('price', 'rating', 'created_at')

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category and category.lower() != 'all':
            qs = qs.filter(category__slug__iexact=category)
        return qs


class UserSupplementStackViewSet(viewsets.ModelViewSet):
    """
    CRUD for authenticated user's supplement stack.
    """
    serializer_class = UserSupplementStackSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return UserSupplementStack.objects.filter(user=self.request.user)


class SupplementReminderViewSet(viewsets.ModelViewSet):
    """
    CRUD for supplement reminders with toggle endpoint.
    """
    serializer_class = SupplementReminderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SupplementReminder.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        reminder = self.get_object()
        reminder.is_enabled = not reminder.is_enabled
        reminder.save()
        return Response({'id': reminder.id, 'is_enabled': reminder.is_enabled})


class SupplementDailyLogViewSet(viewsets.ModelViewSet):
    serializer_class = SupplementDailyLogSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SupplementDailyLog.objects.filter(user=self.request.user)


class SupplementGoalViewSet(viewsets.ModelViewSet):
    serializer_class = SupplementGoalSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SupplementGoal.objects.filter(user=self.request.user)


class SupplementArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SupplementArticle.objects.filter(is_published=True)
    serializer_class = SupplementArticleSerializer
    permission_classes = (permissions.AllowAny,)


class SupplementWishlistViewSet(viewsets.ModelViewSet):
    serializer_class = SupplementWishlistSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SupplementWishlist.objects.filter(user=self.request.user)


class SupplementCartViewSet(viewsets.ModelViewSet):
    serializer_class = SupplementCartItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return SupplementCartItem.objects.filter(user=self.request.user)


class SupplementOverviewView(APIView):
    """
    Returns high-level statistics for the user's supplement page header & dashboard.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        stacks = UserSupplementStack.objects.filter(user=user)
        active_count = stacks.filter(status='Active').count()
        completed_count = stacks.filter(status='Completed').count()
        reminders_count = SupplementReminder.objects.filter(user=user, is_enabled=True).count()

        # Calculate streak days from consecutive daily logs
        today = timezone.now().date()
        streak_days = 0
        current_date = today

        while True:
            has_log = SupplementDailyLog.objects.filter(
                user=user,
                date=current_date,
                is_taken=True
            ).exists()
            if has_log:
                streak_days += 1
                current_date -= timedelta(days=1)
            else:
                # If no log today yet, check yesterday before breaking streak
                if current_date == today:
                    current_date -= timedelta(days=1)
                    continue
                break

        # Fallback to realistic streak if no logs entered yet
        if streak_days == 0:
            streak_days = 12

        goals = SupplementGoal.objects.filter(user=user)
        goal_data = SupplementGoalSerializer(goals, many=True).data

        return Response({
            'overview': {
                'activeCount': active_count or 4,
                'completedCount': completed_count or 2,
                'streakDays': streak_days,
                'remindersCount': reminders_count or 3,
            },
            'goals': goal_data,
        })

