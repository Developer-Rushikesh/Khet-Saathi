from django.contrib import admin
from .models import Reminder

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('title', 'farmer', 'crop', 'reminder_date', 'status', 'created_at')
    list_filter = ('status', 'reminder_date')
    search_fields = ('title', 'farmer__email', 'crop__crop_name')
