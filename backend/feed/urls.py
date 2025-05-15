from django.urls import path
from . import views


# ver estes caminhos
urlpatterns = [
    # Posts
    path('houses/<int:house_id>/posts/', views.post_list_create, name='post_list_create'),
    path('posts/<int:pk>/', views.post_detail, name='post_detail'),

    # Comentários
    path('posts/<int:post_id>/comments/', views.comment_list_create, name='comment_list_create'),
    path('comments/<int:pk>/', views.comment_detail, name='comment_detail'),
]