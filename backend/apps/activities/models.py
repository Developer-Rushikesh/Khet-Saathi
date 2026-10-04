from django.db import models
from django.conf import settings
from apps.crops.models import Crop

class Activity(models.Model):
    TYPE_CHOICES = (
        ('SOWING', 'Sowing'),
        ('IRRIGATION', 'Irrigation'),
        ('SPRAY', 'Spray'),
        ('FERTILIZER', 'Fertilizer'),
        ('PEST_DISEASE', 'Pest/Disease'),
        ('WEEDING', 'Weeding'),
        ('HARVEST', 'Harvest'),
        ('OTHER', 'Other'),
    )

    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    activity_date = models.DateField()
    product_name = models.CharField(max_length=255, blank=True, null=True)
    quantity = models.CharField(max_length=100, blank=True, null=True)
    unit = models.CharField(max_length=50, blank=True, null=True)
    reason = models.CharField(max_length=255, blank=True, null=True)

    # Worker / Labor Cost Tracking fields
    person_count = models.IntegerField(default=0, help_text="Number of persons/workers used")
    cost_per_person = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Daily wage rate per person")
    labor_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Calculated as person_count * cost_per_person")
    material_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Direct item or product cost")
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Total Activity Expense")
    income = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Revenue gained from harvest sale")

    notes = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='activities/', blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-activity_date', '-created_at']

    def save(self, *args, **kwargs):
        # Auto-calculate labor cost & total cost
        self.labor_cost = (self.person_count or 0) * (self.cost_per_person or 0)
        if not self.cost or self.cost == 0:
            self.cost = (self.material_cost or 0) + self.labor_cost
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.activity_type} on {self.crop.crop_name} ({self.activity_date})"
