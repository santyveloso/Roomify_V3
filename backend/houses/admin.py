from django.contrib import admin
from .models import House, Invitation


admin.site.register(House)
#admin.site.register(HouseMembership)
admin.site.register(Invitation)