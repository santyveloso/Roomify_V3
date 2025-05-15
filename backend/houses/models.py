from django.db import models
from django.conf import settings
import uuid
from django.contrib.auth import get_user_model

# Para obter os membros de uma casa, fazemos house.members.all().

# Para saber a casa de um utilizador, user.house.
# o user vai ter q ter uma fk pra casa

class House(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    description = models.TextField(blank=True, null=True)
    rules = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='administered_houses'
    )

    invite_code = models.CharField(max_length=10, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.invite_code:
            self.invite_code = str(uuid.uuid4())[:10]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Invitation(models.Model):
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    code = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Convite para {self.house.name} ({self.code})"

















## ISTO ERA O CODIGO DE MTS PRA MTS


# User = get_user_model()
# # Modelo que representa uma casa partilhada
# class House(models.Model):
#     name = models.CharField(max_length=100)
#     address = models.TextField()
#     description = models.TextField(blank=True, null=True)
#     rules = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     # O 'on_delete=models.CASCADE' garante que, se o admin for apagado, a casa também é (fk)
#     admin = models.ForeignKey(
#         settings.AUTH_USER_MODEL,  # usa o modelo de utilizador personalizado (lisa?)
#         on_delete=models.CASCADE,
#         related_name='administered_houses'  # Permite ver as casas administradas por um utilizador
#     )
    
#     # Membros da casa (relacionamento muitos-para-muitos entre utilizadores e casas)
#     # A tabela intermediária é definida pelo modelo 'HouseMembership'
#     members = models.ManyToManyField(
#         settings.AUTH_USER_MODEL,  
#         through='HouseMembership',  # Especifica o modelo intermediário para controlar o relacionamento
#         related_name='houses'  # Permite ver as casas em que um utilizador está
#     )
    
#     # Código de convite único (para adicionar membros à casa sem ser manualmente)
#     # Ele é gerado automaticamente caso não exista
#     invite_code = models.CharField(max_length=10, unique=True, blank=True, null=True)
    
#     # Método 'save' para garantir que o código de convite é sempre gerado antes de salvar
#     def save(self, *args, **kwargs):
#         if not self.invite_code:
#             # Geração do código único usando UUID e truncando para 10 caracteres
#             self.invite_code = str(uuid.uuid4())[:10]
#         super().save(*args, **kwargs)  # Chama o método 'save' do Django para salvar a instância no banco de dados
    
#     # Representação da casa (utilizada quando for exibida em listas ou admin)
#     def __str__(self):
#         return self.name  # Retorna o nome da casa como representação textual

# # Modelo que representa a associação entre um utilizador e uma casa
# # Controla quem são os membros e quando se juntaram à casa
# class HouseMembership(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Relacionamento com o utilizador
#     house = models.ForeignKey(House, on_delete=models.CASCADE)  # Relacionamento com a casa
#     joined_at = models.DateTimeField(auto_now_add=True)  # Data em que o utilizador se juntou à casa
    
#     # Garantir que um utilizador só pode ser membro de uma casa uma vez
#     class Meta:
#         unique_together = ('user', 'house')  # Garante que o par (user, house) seja único
    
#     def __str__(self):
#         # Retorna uma string indicando qual utilizador está em qual casa
#         return f"{self.user.username} - {self.house.name}"

# # Modelo de convite para adicionar novos membros a uma casa
# # Usado para gerar códigos de convite com data de expiração
# class Invitation(models.Model):
#     house = models.ForeignKey(House, on_delete=models.CASCADE)  # Casa à qual o convite pertence
#     code = models.CharField(max_length=10, unique=True)  # Código único de convite
#     created_at = models.DateTimeField(auto_now_add=True)  
#     expires_at = models.DateTimeField()  
#     is_used = models.BooleanField(default=False)  # Status para verificar se o convite foi usado
    
#     def __str__(self):
#         # Retorna uma string indicando o convite para uma casa específica
#         return f"Convite para {self.house.name} ({self.code})"