from rest_framework import serializers
from datetime import date
from .models import Reminder

class ReminderSerializer(serializers.ModelSerializer):
    crop_name = serializers.ReadOnlyField(source='crop.crop_name')
    farm_name = serializers.ReadOnlyField(source='crop.farm.name')
    due_status = serializers.SerializerMethodField()

    class Meta:
        model = Reminder
        fields = (
            'id', 'farmer', 'crop', 'crop_name', 'farm_name', 'activity',
            'title', 'reminder_date', 'notes', 'status', 'due_status',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'farmer', 'crop_name', 'farm_name', 'due_status', 'created_at', 'updated_at')

    def get_due_status(self, obj):
        if obj.status == 'COMPLETED':
            return 'completed'
        today_date = date.today()
        if obj.reminder_date < today_date:
            return 'overdue'
        elif obj.reminder_date == today_date:
            return 'today'
        else:
            return 'upcoming'

    def validate_crop(self, crop):
        if crop:
            user = self.context['request'].user
            if user.role != 'admin' and crop.farm.owner != user:
                raise serializers.ValidationError("You do not own the farm for this crop.")
        return crop
