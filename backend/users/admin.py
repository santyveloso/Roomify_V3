from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

#admin.site.register(CustomUser, UserAdmin)

# Registrando o modelo CustomUser no painel de administração
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'user_type')  # Campos que você deseja exibir na lista
    search_fields = ('username', 'email')  # Campos para pesquisar
    list_filter = ('user_type',)  # Filtro para o campo 'user_type'