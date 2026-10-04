from rest_framework import serializers
from .models import Crop

class CropSerializer(serializers.ModelSerializer):
    farm_name = serializers.ReadOnlyField(source='farm.name')
    farm_owner_id = serializers.ReadOnlyField(source='farm.owner_id')

    class Meta:
        model = Crop
        fields = (
            'id', 'farm', 'farm_name', 'farm_owner_id', 'crop_name', 'variety',
            'season', 'area', 'sowing_date', 'expected_harvest_date',
            'status', 'notes', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'farm_name', 'farm_owner_id', 'created_at', 'updated_at')

    def validate_farm(self, farm):
        user = self.context['request'].user
        if user.role != 'admin' and farm.owner != user:
            raise serializers.ValidationError("You do not own this farm.")
        return farm
