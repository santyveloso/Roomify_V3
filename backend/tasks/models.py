from django.db import models
from django.conf import settings
from houses.models import House
from django.contrib.auth import get_user_model

User = get_user_model()



class Task(models.Model):
    TASK_STATUS_CHOICES = (
        ('to_do', 'TO DO'),
        ('in_progress', 'Em Progresso'),
        ('completed', 'Concluída'),
    )

    #por mim simplificamos tiramos isto

    # TASK_TYPE_CHOICES = (
    #     ('one_time', 'Única'),
    #     ('recurring', 'Recorrente'),
    # )
    # RECURRENCE_CHOICES = (
    #     ('daily', 'Diária'),
    #     ('weekly', 'Semanal'),
    #     ('biweekly', 'Quinzenal'),
    #     ('monthly', 'Mensal'),
    # )
    
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name='tasks')



    #VER USERS
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks'
    )

    #
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tasks'
    )


   



    status = models.CharField(max_length=15, choices=TASK_STATUS_CHOICES, default='pending')


    # se simplificarmos adicionamos isto (ver user ns)
    completed_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
   # task_type = models.CharField(max_length=15, choices=TASK_TYPE_CHOICES, default='one_time')
    due_date = models.DateTimeField(null=True, blank=True)
    #recurrence = models.CharField(max_length=15, choices=RECURRENCE_CHOICES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title



#por mim simplificamos tiramos isto

# class TaskCompletion(models.Model):
#     task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='completions')
#     completed_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name='task_completions'
#     )
#     completed_at = models.DateTimeField(auto_now_add=True)
#     comment = models.TextField(blank=True, null=True)
#     photo_proof = models.ImageField(upload_to='task_completions/', blank=True, null=True)

#     def __str__(self):
#         return f"{self.task.title} - {self.completed_by.username}"