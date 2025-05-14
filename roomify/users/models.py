import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    USER_TYPES = [
        ('lider', 'Leader'),
        ('roomie', 'Roomie'),
    ]
    email = models.EmailField(unique=True) 
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='roomie')
    phone = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.user_type})"

