from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    DailyHealthLog,
    ReportGoal,
    ReportAreaOfImprovement,
    ReportAIInsight,
    RecentActivity,
)
from .serializers import (
    DailyHealthLogSerializer,
    ReportGoalSerializer,
    ReportAreaOfImprovementSerializer,
    ReportAIInsightSerializer,
    RecentActivitySerializer,
)
from .services import AnalyticsService

class AnalyticsReportView(APIView):
    """
    Main Analytics Endpoint powering the FitNova Reports Page.
    Accepts query parameters:
    - period: 7d, 30d, 3m, 1y (default 7d)
    - tab: overview, nutrition, workouts, body-stats, water-intake, sleep, supplements
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        period = request.query_params.get('period', '7d').lower()
        tab = request.query_params.get('tab', 'overview').lower()
        
        report_data = AnalyticsService.generate_report(
            user=request.user,
            period=period,
            tab=tab
        )
        return Response(report_data, status=status.HTTP_200_OK)


class DailyHealthLogViewSet(viewsets.ModelViewSet):
    serializer_class = DailyHealthLogSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return DailyHealthLog.objects.filter(user=self.request.user)


class ReportGoalViewSet(viewsets.ModelViewSet):
    serializer_class = ReportGoalSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return ReportGoal.objects.filter(user=self.request.user)


class ReportImprovementViewSet(viewsets.ModelViewSet):
    serializer_class = ReportAreaOfImprovementSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return ReportAreaOfImprovement.objects.filter(user=self.request.user)


class RecentActivityViewSet(viewsets.ModelViewSet):
    serializer_class = RecentActivitySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return RecentActivity.objects.filter(user=self.request.user)

