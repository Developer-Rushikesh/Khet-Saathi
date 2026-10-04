from django.urls import path
from .views import DashboardReportView, CropReportView, ExpenseReportView

urlpatterns = [
    path('dashboard/', DashboardReportView.as_view(), name='report_dashboard'),
    path('crop/<int:pk>/', CropReportView.as_view(), name='report_crop'),
    path('expenses/', ExpenseReportView.as_view(), name='report_expenses'),
]
