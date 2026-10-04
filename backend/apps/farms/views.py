from rest_framework import viewsets, permissions
from .models import Farm
from .serializers import FarmSerializer

class FarmViewSet(viewsets.ModelViewSet):
    serializer_class = FarmSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Farm.objects.none()
        if getattr(user, 'role', 'farmer') == 'admin':
            return Farm.objects.all()
        return Farm.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
