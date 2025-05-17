from django.urls import path
from . import views

from django.urls import path
from . import views

urlpatterns = [
    path('houses/<int:house_id>/tasks/', views.tasks),
    path('<int:task_id>/', views.task_detail),
    path('<int:task_id>/complete/', views.complete_task),
    #path('<int:task_id>/completion/', views.create_task_completion),
]

# # ver estes caminhos
# urlpatterns = [
#     # Posts
#     path('houses/<int:house_id>/posts/', views.post_list_create, name='post_list_create'),
#     path('posts/<int:pk>/', views.post_detail, name='post_detail'),

#     # Comentários
#     path('posts/<int:post_id>/comments/', views.comment_list_create, name='comment_list_create'),
#     path('comments/<int:pk>/', views.comment_detail, name='comment_detail'),
# ]