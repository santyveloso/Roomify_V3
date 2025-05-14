
from django.urls import path
from . import views

urlpatterns = [
    path('', views.houses, name='houses'),
    path('<int:house_id>/', views.house_detail, name='house_detail'),
    path('<int:house_id>/members/', views.house_members, name='house_members'),
    path('<int:house_id>/generate_invite/', views.generate_invite, name='generate_invite'),
    path('join/', views.join_house, name='join'),
    path('<int:house_id>/remove_member/', views.remove_member, name='remove_member'),
]