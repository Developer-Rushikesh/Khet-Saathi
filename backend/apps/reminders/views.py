from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date, timedelta
from .models import Reminder
from .serializers import ReminderSerializer

class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Reminder.objects.none()

        qs = Reminder.objects.all() if getattr(user, 'role', 'farmer') == 'admin' else Reminder.objects.filter(farmer=user)

        filter_status = self.request.query_params.get('filter')
        today_date = date.today()

        if filter_status == 'today':
            qs = qs.filter(reminder_date=today_date).exclude(status='COMPLETED')
        elif filter_status == 'upcoming':
            qs = qs.filter(reminder_date__gt=today_date).exclude(status='COMPLETED')
        elif filter_status == 'overdue':
            qs = qs.filter(reminder_date__lt=today_date).exclude(status='COMPLETED')
        elif filter_status == 'completed':
            qs = qs.filter(status='COMPLETED')

        return qs

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

    @action(detail=True, methods=['patch', 'post'], url_path='mark-completed')
    def mark_completed(self, request, pk=None):
        reminder = self.get_object()
        reminder.status = 'COMPLETED'
        reminder.save()
        return Response({'success': True, 'message': 'Reminder marked as completed!', 'data': ReminderSerializer(reminder).data})

    @action(detail=True, methods=['patch', 'post'], url_path='snooze')
    def snooze(self, request, pk=None):
        reminder = self.get_object()
        days = int(request.data.get('days', 2))
        reminder.reminder_date = reminder.reminder_date + timedelta(days=days)
        reminder.status = 'SNOOZED'
        reminder.save()
        return Response({'success': True, 'message': f'Reminder snoozed by {days} days!', 'data': ReminderSerializer(reminder).data})
