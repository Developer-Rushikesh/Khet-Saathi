from rest_framework import serializers
from .models import Farm

class FarmSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.name')

    class Meta:
        model = Farm
        fields = ('id', 'owner', 'owner_name', 'name', 'village', 'location', 'area', 'unit', 'notes', 'image', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'owner_name', 'created_at', 'updated_at')
