from django.contrib import admin
from .models import CustomUser

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id','get_username', 'get_email', 'user_type', 'phone')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'
    get_username.admin_order_field = 'user__username'  # para ordenar por username no admin

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'
    get_email.admin_order_field = 'user__email'  # para ordenar por email no admin

admin.site.register(CustomUser, CustomUserAdmin)