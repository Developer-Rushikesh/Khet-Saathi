from rest_framework import viewsets, permissions
from django_filters import rest_framework as filters
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseFilter(filters.FilterSet):
    date_from = filters.DateFilter(field_name="expense_date", lookup_expr='gte')
    date_to = filters.DateFilter(field_name="expense_date", lookup_expr='lte')

    class Meta:
        model = Expense
        fields = ['crop', 'category', 'date_from', 'date_to']

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ExpenseFilter

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return Expense.objects.none()
        if getattr(user, 'role', 'farmer') == 'admin':
            return Expense.objects.all()
        return Expense.objects.filter(crop__farm__owner=user)
