from django.db import models
from django.conf import settings
from apps.crops.models import Crop
from apps.activities.models import Activity

class Reminder(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('SNOOZED', 'Snoozed'),
        ('CANCELLED', 'Cancelled'),
    )

    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reminders')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='reminders', blank=True, null=True)
    activity = models.ForeignKey(Activity, on_delete=models.SET_NULL, related_name='reminders', blank=True, null=True)
    title = models.CharField(max_length=255)
    reminder_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['reminder_date', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.reminder_date}) - {self.status}"
