from django.db import models
from apps.farms.models import Farm

class Crop(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('harvested', 'Harvested'),
        ('archived', 'Archived'),
    )

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='crops')
    crop_name = models.CharField(max_length=255)
    variety = models.CharField(max_length=255, blank=True, null=True)
    season = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Kharif 2026, Rabi 2026")
    area = models.DecimalField(max_digits=8, decimal_places=2)
    sowing_date = models.DateField()
    expected_harvest_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.crop_name} ({self.variety or 'Standard'}) - {self.farm.name}"
