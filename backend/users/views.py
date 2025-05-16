from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status

from users.models import CustomUser
from users.serializers import CustomUserSerializer


############## SIGNUP ##################

@api_view(['POST'])
def signup(request):

    username = request.data.get('username')   
    password = request.data.get('password')

    if username is None or password is None:
        return Response({'error': 'invalid username/password'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
     # Campos opcionais
    email = request.data.get('email')
    phone = request.data.get('phone')
    user_type = request.data.get('user_type', 'ROOMIE')  # default = ROOMIE
    profile_picture = request.data.get('profile_picture')  # imagem opcional


    #cria o User Django
    user = User.objects.create_user(username=username, password=password, email=email)

    #cria o user personalizado (o nosso user) com o user django + campos extra
    CustomUser.objects.create(user=user, phone=phone, user_type=user_type, profile_picture=profile_picture)
    return Response({'message': 'User ' + user.username + ' created successfully'}, status=status.HTTP_201_CREATED)


############## LOGIN ##################

@api_view(['POST'])
def login_view(request):
    """
    Autenticação de utilizadores
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user) # Criação da sessão
        
        # Obter informações do perfil do utilizador
        try:
            customUser = CustomUser.objects.get(user=user)
            house_info = None
            if customUser.house:
                house_info = {
                    'id': customUser.house.id,
                    'nome': customUser.house.nome,
                    'is_admin': customUser.user_type == 'ADMIN'
                }

        except CustomUser.DoesNotExist:
            customUser = CustomUser.objects.create(user=user)
            house_info = None
        
        return Response({
            'message': 'Login efetuado com sucesso',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                # 'first_name': user.first_name,
                # 'last_name': user.last_name,
                'casa': house_info
            }
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


############## LOGOUT ##################

@api_view(['GET'])
def logout_view(request):
    """
    Terminar sessão de utilizador
    """
    logout(request)
    return Response({'message': 'Logout efetuado com sucesso'})



############## CUSTOMUSER_VIEW ##################

# ver (get) ou editar perfil de utilizador (ou apagar? por opção dele apagar o perfil e sai automaticamente da casa)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def customUser_view(request):

    print("customUser_view foi chamada")
    print("Utilizador autenticado?", request.user.is_authenticated)
    print("Utilizador:", request.user)
    if request.method == 'GET':
        print("hellooo")
        try:
            print("hellooo2")
            profile = CustomUser.objects.get(user=request.user)
            print("hellooo3")
            serializer = CustomUserSerializer(profile)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({'error': "Perfil não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Erro inesperado: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    elif request.method == 'PUT':
        profile = CustomUser.objects.get(user=request.user)
        serializer = CustomUserSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # serializer sabe atualizar o user (TEM O UPDATE)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



