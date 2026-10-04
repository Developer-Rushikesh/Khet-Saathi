from django.contrib import admin
from .models import Crop

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'farm', 'variety', 'season', 'area', 'sowing_date', 'status')
    list_filter = ('status', 'season', 'sowing_date')
    search_fields = ('crop_name', 'variety', 'farm__name', 'farm__owner__email')
