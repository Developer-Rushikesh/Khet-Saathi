from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('activity_type', 'crop', 'activity_date', 'product_name', 'person_count', 'cost_per_person', 'cost', 'income', 'created_by')
    list_filter = ('activity_type', 'activity_date')
    search_fields = ('activity_type', 'product_name', 'crop__crop_name', 'created_by__email')
