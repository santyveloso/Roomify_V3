# users/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = [
            'id', 'username', 'email',
            'user_type', 'phone', 'profile_picture',
            'password'
        ]

    def create(self, validated_data):
        pwd  = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(pwd)
        user.save()
        return user
    
    def update(self, request, *args, **kwargs):
        partial = True  # <- isto é essencial
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

