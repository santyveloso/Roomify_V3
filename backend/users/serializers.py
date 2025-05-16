

from rest_framework import serializers
from users.models import CustomUser
from houses.serializers import HouseSerializer  # importa o serializer da house


class CustomUserSerializer(serializers.ModelSerializer):

    # campos que temos que ir buscar ao user
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    house = HouseSerializer(read_only=True)

    class Meta:
        model = CustomUser
        

        fields = ['username', 'email', 'phone', 'user_type', 'profile_picture', 'house']
       # fields = ['username', 'email', 'phone', 'user_type', 'profile_picture', 'house']

    def update(self, instance, validated_data):
        # Separar os dados do user
        user_data = validated_data.pop('user', {})

        # Atualiza os dados do CustomUser
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Atualiza os dados do utilizador associado
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        instance.save()
        return instance