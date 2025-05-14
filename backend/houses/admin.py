from django.contrib import admin
from .models import House, Invitation, HouseMembership


admin.site.register(House)
admin.site.register(HouseMembership)
admin.site.register(Invitation)