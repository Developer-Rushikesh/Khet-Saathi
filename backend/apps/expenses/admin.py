from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('crop', 'category', 'amount', 'expense_date', 'description', 'created_at')
    list_filter = ('category', 'expense_date')
    search_fields = ('crop__crop_name', 'category', 'description')
