# core/urls.py
from django.urls import path
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer

urlpatterns = [
    path('', RegisterView.as_view(serializer_class=CustomRegisterSerializer), name='registration'),  # Mudamos a URL para ""
]
