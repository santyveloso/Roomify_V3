from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer, TaskCompletionSerializer
from django.utils import timezone


# Frontend
# Mostra para todos os Roomies todas as tarefas da casa e a quem estão atribuídas. (pode ser numa pag de tasks e no dashboard so ve as dele)

# Só o Roomie atribuíd o botão “Completar” estará ativo para ele.

# Quando clica, faz POST /api/tasks/<id>/complete/ para marcar a tarefa como concluída.



@api_view(['GET', 'POST'])
def tasks(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
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

    # TaskCompletion.objects.create(
    #     task=task,
    #     completed_by=request.user
    # )

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