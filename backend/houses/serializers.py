from rest_framework import serializers
from .models import House, HouseMembership, Invitation
from django.contrib.auth import get_user_model

#User = get_user_model()
# ver _all_ e readonly cmo quero fazer 

# Serializer para a casa
class HouseSerializer(serializers.ModelSerializer):
    # Inclui o nome do administrador da casa (relacionado com o usuário)
    admin = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = House
        fields = ['id', 'name', 'address', 'description', 'rules', 'created_at', 'updated_at', 'admin', 'invite_code']






# # Serializer para a associação de membros da casa
# class HouseMembershipSerializer(serializers.ModelSerializer):
#     user = serializers.StringRelatedField()  # Exibe o nome do usuário
#     house = serializers.StringRelatedField()  # Exibe o nome da casa

#     class Meta:
#         model = HouseMembership
#         fields = ['user', 'house', 'joined_at']

# Serializer para o convite (ns se isto vai ser preciso)
class InvitationSerializer(serializers.ModelSerializer):
    house = HouseSerializer()  # Exibe os dados da casa relacionada

    class Meta:
        model = Invitation
        fields = ['id', 'house', 'code', 'created_at', 'expires_at', 'is_used']