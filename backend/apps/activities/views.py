from rest_framework import viewsets, permissions
from django_filters import rest_framework as filters
from .models import Activity
from .serializers import ActivitySerializer

class ActivityFilter(filters.FilterSet):
    date_from = filters.DateFilter(field_name="activity_date", lookup_expr='gte')
    date_to = filters.DateFilter(field_name="activity_date", lookup_expr='lte')

    class Meta:
        model = Activity
        fields = ['crop', 'activity_type', 'date_from', 'date_to']

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ActivityFilter

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Activity.objects.none()
        if getattr(user, 'role', 'farmer') == 'admin':
            return Activity.objects.all()
        return Activity.objects.filter(crop__farm__owner=user)
