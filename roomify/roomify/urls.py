"""
URL configuration for roomify project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# roomify/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    #apps do projeto
    path('users/', include('users.urls')),
    path('houses/', include('houses.urls')),
    path('tasks/', include('tasks.urls')),
    #path('expenses/', include('expenses.urls')),
    #path('feed/', include('feed.urls')),
   
   
    path('api/auth/', include('dj_rest_auth.urls')),  # URLs padrão de autenticação, como login, logout, etc.
    path('api/auth/registration/', include('users.urls')),  # Incluindo as URLs de registo do seu aplicativo 'core'


]