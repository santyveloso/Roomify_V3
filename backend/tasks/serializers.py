from rest_framework import serializers
from .models import Task
from houses.models import House
from django.contrib.auth import get_user_model

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'house', 'assigned_to', 
            'created_by', 'status', 'task_type', 'due_date', 'recurrence', 
            'created_at', 'updated_at', 'completed_at'
        ]

class TaskCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        #model = TaskCompletion
        fields = [
            'id', 'task', 'completed_by', 'completed_at', 'comment', 'photo_proof'
        ]