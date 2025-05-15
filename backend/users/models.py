import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils import timezone

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    USER_TYPES = [
        ('leader', 'Líder'),
        ('roomie', 'Roomie'),
    ]
    email = models.EmailField('Email', unique=True) 
    user_type = models.CharField('Tipo de Utilizador', max_length=10, choices=USER_TYPES, default='roomie')
    phone = models.CharField('Telefone', max_length=20, blank=True)
    profile_picture = models.ImageField('Foto de Perfil', upload_to='profile_pics/', blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = 'Utilizador'
        verbose_name_plural = 'Utilizadores'
        ordering = ['username']

    def __str__(self):
        return f"{self.username} ({self.user_type})"

