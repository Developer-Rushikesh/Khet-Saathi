from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Crop
from .serializers import CropSerializer

class CropViewSet(viewsets.ModelViewSet):
    serializer_class = CropSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['farm', 'status']

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Crop.objects.none()
        if getattr(user, 'role', 'farmer') == 'admin':
            return Crop.objects.all()
        return Crop.objects.filter(farm__owner=user)
