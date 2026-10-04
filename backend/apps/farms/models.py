from django.db import models
from django.conf import settings

class Farm(models.Model):
    UNIT_CHOICES = (
        ('acre', 'Acre'),
        ('hectare', 'Hectare'),
    )

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='farms')
    name = models.CharField(max_length=255)
    village = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    area = models.DecimalField(max_digits=8, decimal_places=2, help_text="Area in acres or hectares")
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='acre')
    notes = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='farms/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.village or 'Farm'} ({self.area} {self.unit})"
