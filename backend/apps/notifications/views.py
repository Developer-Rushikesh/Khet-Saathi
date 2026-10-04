from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Notification.objects.all()
        return Notification.objects.filter(user=user)

    @action(detail=True, methods=['patch', 'post'], url_path='read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({
            'success': True,
            'message': 'Notification marked as read',
            'data': NotificationSerializer(notification).data
        })

    @action(detail=False, methods=['patch', 'post'], url_path='read-all')
    def mark_all_read(self, request):
        self.get_queryset().update(read=True)
        return Response({
            'success': True,
            'message': 'All notifications marked as read'
        })
