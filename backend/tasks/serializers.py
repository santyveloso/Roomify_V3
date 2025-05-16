from rest_framework import serializers
from .models import Task
from houses.models import House
from django.contrib.auth import get_user_model

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'house', 'assigned_to', 
            'created_by', 'status', 'due_date', 
            'created_at', 'updated_at', 'completed_at', 'completed_by'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at', 'completed_at', 'completed_by']

class TaskCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        #model = TaskCompletion
        fields = [
            'id', 'task', 'completed_by', 'completed_at', 'comment', 'photo_proof'
        ]