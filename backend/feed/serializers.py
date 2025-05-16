from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

# n vi nada disto VER COMO É SUPOSTO APARECER

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['author', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    house = serializers.PrimaryKeyRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'house', 'author', 'content', 'is_aviso', 'created_at', 'updated_at', 'comments']
        read_only_fields = ['author', 'created_at', 'updated_at', 'comments']