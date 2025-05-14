from django.urls import path
from . import views

from django.urls import path
from . import views

urlpatterns = [
    path('', views.tasks),
    path('<int:task_id>/', views.task_detail),
    path('<int:task_id>/complete/', views.complete_task),
    path('<int:task_id>/completion/', views.create_task_completion),
]