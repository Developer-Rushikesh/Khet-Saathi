from rest_framework import serializers
from .models import Activity
from apps.expenses.models import Expense

class ActivitySerializer(serializers.ModelSerializer):
    crop_name = serializers.ReadOnlyField(source='crop.crop_name')
    farm_id = serializers.ReadOnlyField(source='crop.farm.id')
    farm_name = serializers.ReadOnlyField(source='crop.farm.name')
    created_by_name = serializers.ReadOnlyField(source='created_by.name')

    class Meta:
        model = Activity
        fields = (
            'id', 'crop', 'crop_name', 'farm_id', 'farm_name', 'activity_type',
            'activity_date', 'product_name', 'quantity', 'unit', 'reason',
            'person_count', 'cost_per_person', 'labor_cost', 'material_cost',
            'cost', 'income', 'notes', 'image', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'crop_name', 'farm_id', 'farm_name', 'labor_cost',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        )

    def validate_crop(self, crop):
        user = self.context['request'].user
        if user.role != 'admin' and crop.farm.owner != user:
            raise serializers.ValidationError("You do not own the farm for this crop.")
        return crop

    def create(self, validated_data):
        user = self.context['request'].user
        activity = Activity.objects.create(created_by=user, **validated_data)
        
        # Auto-create Expense if cost > 0
        if activity.cost > 0:
            labor_desc = f" (Labor: {activity.person_count} persons @ ₹{activity.cost_per_person})" if activity.person_count > 0 else ""
            Expense.objects.create(
                crop=activity.crop,
                activity=activity,
                category=activity.activity_type.capitalize(),
                amount=activity.cost,
                expense_date=activity.activity_date,
                description=f"{activity.get_activity_type_display()} cost: {activity.product_name or 'Activity expense'}{labor_desc}",
                receipt_image=activity.image
            )
        return activity

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Sync linked Expense
        if instance.cost > 0:
            labor_desc = f" (Labor: {instance.person_count} persons @ ₹{instance.cost_per_person})" if instance.person_count > 0 else ""
            Expense.objects.update_or_create(
                activity=instance,
                defaults={
                    'crop': instance.crop,
                    'category': instance.activity_type.capitalize(),
                    'amount': instance.cost,
                    'expense_date': instance.activity_date,
                    'description': f"{instance.get_activity_type_display()} cost: {instance.product_name or 'Activity expense'}{labor_desc}",
                    'receipt_image': instance.image
                }
            )
        else:
            Expense.objects.filter(activity=instance).delete()

        return instance
