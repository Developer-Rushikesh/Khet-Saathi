from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from datetime import date
from django.db.models import Sum, Count
from apps.farms.models import Farm
from apps.crops.models import Crop
from apps.activities.models import Activity
from apps.reminders.models import Reminder
from apps.expenses.models import Expense
from apps.notifications.models import Notification

class DashboardReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today_date = date.today()

        if user.role == 'admin':
            farms = Farm.objects.all()
            crops = Crop.objects.filter(status='active')
            activities_today = Activity.objects.filter(activity_date=today_date)
            reminders = Reminder.objects.all()
            expenses = Expense.objects.all()
            recent_activities = Activity.objects.all()[:5]
            recent_notifications = Notification.objects.all()[:5]
        else:
            farms = Farm.objects.filter(owner=user)
            crops = Crop.objects.filter(farm__owner=user, status='active')
            activities_today = Activity.objects.filter(crop__farm__owner=user, activity_date=today_date)
            reminders = Reminder.objects.filter(farmer=user)
            expenses = Expense.objects.filter(crop__farm__owner=user)
            recent_activities = Activity.objects.filter(crop__farm__owner=user)[:5]
            recent_notifications = Notification.objects.filter(user=user)[:5]

        upcoming_reminders = reminders.filter(reminder_date__gte=today_date).exclude(status='COMPLETED').count()
        overdue_reminders = reminders.filter(reminder_date__lt=today_date).exclude(status='COMPLETED').count()
        total_expense_sum = float(expenses.aggregate(Sum('amount'))['amount__sum'] or 0)

        activity_list = [
            {
                'id': act.id,
                'cropName': act.crop.crop_name,
                'farmName': act.crop.farm.name,
                'type': act.get_activity_type_display(),
                'date': str(act.activity_date),
                'productName': act.product_name,
                'cost': float(act.cost),
                'income': float(act.income),
                'personCount': act.person_count,
                'costPerPerson': float(act.cost_per_person)
            }
            for act in recent_activities
        ]

        notification_list = [
            {
                'id': notif.id,
                'title': notif.title,
                'message': notif.message,
                'type': notif.notification_type,
                'read': notif.read,
                'createdAt': notif.created_at.isoformat()
            }
            for notif in recent_notifications
        ]

        return Response({
            'success': True,
            'data': {
                'totalFarms': farms.count(),
                'activeCrops': crops.count(),
                'todaysActivities': activities_today.count(),
                'upcomingReminders': upcoming_reminders,
                'overdueReminders': overdue_reminders,
                'totalExpenses': total_expense_sum,
                'recentActivities': activity_list,
                'recentNotifications': notification_list
            }
        }, status=status.HTTP_200_OK)

class CropReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk=None):
        user = request.user
        try:
            crop = Crop.objects.get(id=pk)
            if user.role != 'admin' and crop.farm.owner != user:
                return Response({'success': False, 'message': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        except Crop.DoesNotExist:
            return Response({'success': False, 'message': 'Crop not found.'}, status=status.HTTP_404_NOT_FOUND)

        activities = Activity.objects.filter(crop=crop)
        expenses = Expense.objects.filter(crop=crop)

        total_expenses = float(expenses.aggregate(Sum('amount'))['amount__sum'] or 0)
        total_income = float(activities.aggregate(Sum('income'))['income__sum'] or 0)
        total_labor_cost = float(activities.aggregate(Sum('labor_cost'))['labor_cost__sum'] or 0)
        total_workers = sum(a.person_count for a in activities)

        cat_breakdown = {}
        for exp in expenses:
            cat = exp.category
            cat_breakdown[cat] = cat_breakdown.get(cat, 0) + float(exp.amount)

        return Response({
            'success': True,
            'data': {
                'cropId': crop.id,
                'cropName': crop.crop_name,
                'farmName': crop.farm.name,
                'variety': crop.variety,
                'season': crop.season,
                'sowingDate': str(crop.sowing_date),
                'expectedHarvestDate': str(crop.expected_harvest_date) if crop.expected_harvest_date else None,
                'totalExpenses': total_expenses,
                'totalLaborCost': total_labor_cost,
                'totalWorkersUsed': total_workers,
                'harvestRevenue': total_income,
                'netProfit': total_income - total_expenses,
                'categoryBreakdown': cat_breakdown
            }
        }, status=status.HTTP_200_OK)

class ExpenseReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        expenses = Expense.objects.all() if user.role == 'admin' else Expense.objects.filter(crop__farm__owner=user)

        total = float(expenses.aggregate(Sum('amount'))['amount__sum'] or 0)

        # Crop-wise breakdown
        crop_summary = {}
        for exp in expenses:
            c_name = exp.crop.crop_name
            crop_summary[c_name] = crop_summary.get(c_name, 0) + float(exp.amount)

        # Category-wise breakdown
        category_summary = {}
        for exp in expenses:
            cat = exp.category
            category_summary[cat] = category_summary.get(cat, 0) + float(exp.amount)

        return Response({
            'success': True,
            'data': {
                'totalExpenses': total,
                'cropSummary': crop_summary,
                'categorySummary': category_summary
            }
        }, status=status.HTTP_200_OK)
