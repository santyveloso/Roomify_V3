from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    /backend/users/  – CRUD de utilizadores
      • POST  → registo (AllowAny)
      • GET / PUT / DELETE → autenticado (JWT)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        # Permitir registo sem token; resto exige JWT
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
