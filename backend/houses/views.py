from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import House, Invitation
from .serializers import HouseSerializer, InvitationSerializer
from django.utils import timezone
from datetime import timedelta
import uuid


def is_house_admin(house, user):
    return house.admin == user

# -------- HOUSES --------
# ver as casas todas e adicionar com o post
@api_view(['GET', 'POST'])
def houses(request):
    if request.method == 'GET':
        houses = House.objects.all()
        serializer = HouseSerializer(houses, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = HouseSerializer(data=request.data)
        if serializer.is_valid():
            #serializer.save()
            serializer.save(admin=request.user) # isto ta a ir buscar o user acho
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ver os detalhes de uma casa especifica pelo id (da pra alterar com o put e apagar com o delete)
@api_view(['GET', 'PUT', 'DELETE'])
def house_detail(request, house_id):
    try:
        house = House.objects.get(pk=house_id)
    except House.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = HouseSerializer(house)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if not is_house_admin(house, request.user):
            return Response({"detail": "Apenas o administrador pode editar a casa."}, status=status.HTTP_403_FORBIDDEN)

        serializer = HouseSerializer(house, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if not is_house_admin(house, request.user):
            return Response({"detail": "Apenas o administrador pode excluir a casa."}, status=status.HTTP_403_FORBIDDEN)
        house.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# -------- MEMBERSHIPS --------

@api_view(['GET'])
def house_members(request, house_id):
    membros = HouseMembership.objects.filter(house__id=house_id)
    serializer = HouseMembershipSerializer(membros, many=True)
    return Response(serializer.data)

#Remover membro da casa
@api_view(['DELETE'])
def remove_member(request, house_id, user_id):
    try:
        house = House.objects.get(pk=house_id)
    except House.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not is_house_admin(house, request.user):
        return Response({"detail": "Apenas o administrador pode remover membros."}, status=status.HTTP_403_FORBIDDEN)

    try:
        membership = HouseMembership.objects.get(house=house, user_id=user_id)
    except HouseMembership.DoesNotExist:
        return Response({"detail": "Membro não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    if membership.user == house.admin:
        return Response({"detail": "Não é possível remover o administrador da casa."}, status=status.HTTP_400_BAD_REQUEST)

    membership.delete()
    return Response({"detail": "Membro removido com sucesso."}, status=status.HTTP_204_NO_CONTENT)


# -------- INVITATIONS --------

@api_view(['POST'])
def generate_invite(request, house_id):
    try:
        house = House.objects.get(pk=house_id)
    except House.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if not is_house_admin(house, request.user):
        return Response({"detail": "Apenas o administrador pode gerar convites."}, status=status.HTTP_403_FORBIDDEN)
    
    # Invalidar convites anteriores (opa ns qual)
    # Invitation.objects.filter(house=house, is_used=False).exclude(expires_at__gt=timezone.now()).update(is_used=True)
    Invitation.objects.filter(house=house, is_used=False).update(is_used=True)

    code = str(uuid.uuid4())[:10]
    expires_at = timezone.now() + timedelta(days=7)

    invitation = Invitation.objects.create(
        house=house,
        code=code,
        expires_at=expires_at
    )
    serializer = InvitationSerializer(invitation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# PARA ADICIONAR UM MEMBRO

@api_view(['POST'])
def join_house(request):
    code = request.data.get('code')
    if not code:
        return Response({"detail": "Código de convite é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        invitation = Invitation.objects.get(code=code, is_used=False, expires_at__gt=timezone.now())
    except Invitation.DoesNotExist:
        return Response({"detail": "Convite inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)

    house = invitation.house
    if HouseMembership.objects.filter(user=request.user, house=house).exists():
        return Response({"detail": "Você já é membro desta casa."}, status=status.HTTP_400_BAD_REQUEST)

    # Adicionar utilizador à casa
    HouseMembership.objects.create(user=request.user, house=house)

    # Marcar convite como usado
    invitation.is_used = True
    invitation.save()

    # Responder com os dados da casa
    serializer = HouseSerializer(house)
    return Response(serializer.data, status=status.HTTP_200_OK)

