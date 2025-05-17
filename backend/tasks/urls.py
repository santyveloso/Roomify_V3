# tasks/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('houses/<int:house_id>/tasks/', views.tasks),             # listar/criar tarefas da casa
    path('tasks/<int:task_id>/', views.task_detail),               # ver/editar/apagar tarefa específica
    path('tasks/<int:task_id>/complete/', views.complete_task),    # concluir tarefa
]
