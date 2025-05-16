"""
Implementação do Sistema de Utilizadores para o RoomiFy
- Criação de utilizadores normais e administradores
- Login e logout
- Perfil de utilizador com avatar e estado
- Configuração de permissões (admin da casa vs roomie)
"""

# models.py - Modelos de dados para utilizadores e perfis
from django.db import models
from django.contrib.auth.models import User

from houses.models import House



class CustomUser(models.Model):
    """
    Perfil de utilizador com informações adicionais além do User padrão do Django.
    Inclui avatar, estado e preferências do utilizador.
    """

    USER_TYPES = [
        ('ADMIN', 'Administrador'),
        ('ROOMIE', 'Roomie'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField('Tipo de Utilizador', max_length=10, choices=USER_TYPES, default='ROOMIE')

    profile_picture = models.ImageField('Foto de Perfil', upload_to='profile_pics/', blank=True, null=True,  default='default_avatar.png')
    #data_nascimento = models.DateField(null=True, blank=True)
    phone = models.CharField('Telefone', max_length=20, blank=True, null=True)

    # tem qeue estar aqui pq ele só pode ter uma
    house = models.ForeignKey(House, on_delete=models.SET_NULL, null=True, blank=True, related_name='membros')
    data_entrada = models.DateTimeField(auto_now=True)

    
    def __str__(self):
        return f"Perfil de {self.user.username}"
    
