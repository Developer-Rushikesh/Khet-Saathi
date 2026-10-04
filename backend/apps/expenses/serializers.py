from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    crop_name = serializers.ReadOnlyField(source='crop.crop_name')
    farm_name = serializers.ReadOnlyField(source='crop.farm.name')

    class Meta:
        model = Expense
        fields = (
            'id', 'crop', 'crop_name', 'farm_name', 'activity', 'category',
            'amount', 'expense_date', 'description', 'receipt_image',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'crop_name', 'farm_name', 'created_at', 'updated_at')

    def validate_crop(self, crop):
        user = self.context['request'].user
        if user.role != 'admin' and crop.farm.owner != user:
            raise serializers.ValidationError("You do not own the farm for this crop.")
        return crop
