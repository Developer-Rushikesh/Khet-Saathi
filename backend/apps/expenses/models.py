from django.db import models
from apps.crops.models import Crop
from apps.activities.models import Activity

class Expense(models.Model):
    CATEGORY_CHOICES = (
        ('Seeds', 'Seeds'),
        ('Fertilizer', 'Fertilizer'),
        ('Spray', 'Spray'),
        ('Labour', 'Labour'),
        ('Equipment', 'Equipment'),
        ('Transport', 'Transport'),
        ('Irrigation', 'Irrigation'),
        ('Harvest', 'Harvest'),
        ('Other', 'Other'),
    )

    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='expenses')
    activity = models.ForeignKey(Activity, on_delete=models.SET_NULL, related_name='linked_expenses', blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    expense_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    receipt_image = models.ImageField(upload_to='receipts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-expense_date', '-created_at']

    def __str__(self):
        return f"{self.category} Expense: ₹{self.amount} for {self.crop.crop_name} ({self.expense_date})"
