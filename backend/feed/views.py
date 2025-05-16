from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Comment, House
from .serializers import PostSerializer, CommentSerializer

# Posts

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_list_create(request, house_id):
    # Listar posts da casa
    if request.method == 'GET':
        posts = Post.objects.filter(house_id=house_id).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    # Criar novo post na casa
    elif request.method == 'POST':
        print("POST recebido:", request.data) 
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            house = House.objects.get(pk=house_id)  # Podes também usar get_object_or_404
            serializer.save(author=request.user, house=house)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def post_detail(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Apenas autor ou admin podem editar ou apagar (podes ajustar a permissão)
    if post.author != request.user:
        return Response({'error': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)






# Comentários

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def comment_list_create(request, post_id):
    # Listar comentários do post
    if request.method == 'GET':
        comments = Comment.objects.filter(post_id=post_id).order_by('created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    # Criar comentário no post
    elif request.method == 'POST':
        data = request.data.copy()
        data['post'] = post_id
        data['author'] = request.user.id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def comment_detail(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response({'error': 'Comentário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Apenas autor ou admin podem editar ou apagar ??
    if comment.author != request.user:
        return Response({'error': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)