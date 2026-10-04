from django.contrib import admin
from .models import Farm

@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'village', 'area', 'unit', 'created_at')
    list_filter = ('unit', 'created_at')
    search_fields = ('name', 'village', 'owner__name', 'owner__email')
