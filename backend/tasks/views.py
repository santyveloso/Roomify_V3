from rest_framework.decorators import api_view,  permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer, TaskCompletionSerializer
from django.utils import timezone


from rest_framework.permissions import IsAuthenticated


# Frontend
# Mostra para todos os Roomies todas as tarefas da casa e a quem estão atribuídas. (pode ser numa pag de tasks e no dashboard so ve as dele)

# Só o Roomie atribuíd o botão “Completar” estará ativo para ele.

# Quando clica, faz POST /api/tasks/<id>/complete/ para marcar a tarefa como concluída.


# @api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
# def post_list_create(request, house_id):
#     # Listar posts da casa
#     if request.method == 'GET':
#         posts = Post.objects.filter(house_id=house_id).order_by('-created_at')
#         serializer = PostSerializer(posts, many=True)
#         return Response(serializer.data)

#     # Criar novo post na casa
#     elif request.method == 'POST':
#         print("POST recebido:", request.data) 
#         serializer = PostSerializer(data=request.data)
#         if serializer.is_valid():
#             house = House.objects.get(pk=house_id) 
#             serializer.save(author=request.user, house=house)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# @api_view(['GET', 'POST'])
# def tasks(request, house_id):
#     if request.method == 'GET':
#         # tasks = Task.objects.all()\
#         #tasks = Task.objects.filter(house__in=request.user.houses.all())  # ou um método alternativo
#         tasks = Task.objects.filter(house=request.user.house)
#         serializer = TaskSerializer(tasks, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = TaskSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(created_by=request.user)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def tasks(request, house_id):
    if request.method == 'GET':
        tasks = Task.objects.filter(house_id=house_id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user, house_id=house_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Response({'detail': 'Tarefa não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # <- esta linha é ESSENCIAL
def complete_task(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Response({'detail': 'Tarefa não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    if task.status == 'completed':
        return Response({'detail': 'Tarefa já está concluída.'}, status=status.HTTP_400_BAD_REQUEST)

    task.status = 'completed'
    task.completed_at = timezone.now()
    task.completed_by = request.user
    task.save()

    return Response({'detail': 'Tarefa concluída com sucesso!'}, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def create_task_completion(request, task_id):
#     try:
#         task = Task.objects.get(pk=task_id)
#     except Task.DoesNotExist:
#         return Response({'detail': 'Tarefa não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

#     serializer = TaskCompletionSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(task=task, completed_by=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)