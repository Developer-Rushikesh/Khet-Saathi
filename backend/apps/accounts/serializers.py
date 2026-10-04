from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'phone', 'preferred_language', 'role', 'created_at')
        read_only_fields = ('id', 'role', 'created_at')

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'phone', 'preferred_language', 'role', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email_or_phone = attrs.get('email', '').strip()
        password = attrs.get('password')

        user = None
        digits = ''.join(c for c in email_or_phone if c.isdigit())

        found_user = None
        if '@' in email_or_phone:
            found_user = User.objects.filter(email__iexact=email_or_phone).first()
        else:
            if digits:
                for u in User.objects.all():
                    u_digits = ''.join(c for c in (u.phone or '') if c.isdigit())
                    if u_digits and (digits in u_digits or u_digits in digits):
                        found_user = u
                        break

        if found_user:
            user = authenticate(request=self.context.get('request'), email=found_user.email, password=password)
        else:
            user = authenticate(request=self.context.get('request'), email=email_or_phone, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email/phone or password credentials.')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        refresh = RefreshToken.for_user(user)
        return {
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
