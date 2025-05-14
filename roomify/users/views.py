from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import CustomUser

class CustomLoginView(APIView):

    # função para quando for enviado um post para o endpoint do login
    def post(self, request):

        #pega noa dados do login
        username = request.data.get("username")
        password = request.data.get("password")
        
        #auentica as credenciais
        user = authenticate(username=username, password=password)
        
        if user is not None:
            #cria um token daquele user
            token, created = Token.objects.get_or_create(user=user)
            # ve qual é o tipo de user do Custom user
            user_type = user.user_type
            #devolve 
            return Response({"key": token.key, "user_type": user_type}, status=status.HTTP_200_OK)
        else:
            # Retornar uma resposta de erro se as credenciais forem inválidas
            return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
