from decimal import Decimal
from django.shortcuts import render


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Expense, ExpenseShare
from .serializers import ExpenseShareSerializer, ExpenseSerializer
from django.contrib.auth import get_user_model
User = get_user_model()




# no frontend ele escolhe se quer dividir igual (automatico) ou personalizado mas só muda o JSON enviado (calcula os valores no frontend do js) o código é igual
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def expenses(request, house_id):
    # u = User.objects.first()
    # print(type(u))  # deve mostrar o teu custom user

    # print('CHAMADO')
    user = request.user
    # print(type(request.user))
    # print(type(user._wrapped)) 
    # print(user)

    # Verifica se o user pertence à casa
    # if not user.housemembership_set.filter(house_id=house_id).exists():
    #     return Response({'error': 'Sem permissão para esta casa'}, status=403)

    if request.method == 'GET':
        expenses = Expense.objects.filter(house_id=house_id).order_by('-date')
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        assigned_roomies = data.get('assigned_roomies', [])

        if not assigned_roomies:
            return Response({'error': 'Deves indicar pelo menos um Roomie para esta despesa'}, status=400)

        total_amount = Decimal(str(data.get('amount')))
        total_due = sum(Decimal(str(share['amount_due'])) for share in assigned_roomies)

        if total_due != total_amount:
            return Response({'error': 'A soma dos valores atribuídos não bate com o total'}, status=400)

        expense_data = {
            'house': house_id,
            'title': data.get('title'),
            'category': data.get('category'),
            'amount': total_amount,
            'date': data.get('date'),
            'description': data.get('description', ''),
        }

        expense_serializer = ExpenseSerializer(data=expense_data)
        if not expense_serializer.is_valid():
            print(expense_serializer.errors)  # ← mostra no terminal o erro
            return Response(expense_serializer.errors, status=400)
        expense = expense_serializer.save(created_by=user)

        for share in assigned_roomies:
            share['expense'] = expense.id
            share['paid'] = False
            share_serializer = ExpenseShareSerializer(data=share)
            if not share_serializer.is_valid():
                print("Erro ExpenseShareSerializer:", share_serializer.errors)
                expense.delete()
                return Response(share_serializer.errors, status=400)
            share_serializer.save()

        

        return Response(ExpenseSerializer(expense).data, status=201)

# @api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
# def expenses(request, house_id):
#     if request.method == 'GET':
#         expenses = Expense.objects.filter(house_id=house_id)
#         serializer = ExpenseSerializer(expenses, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = ExpenseSerializer(data=request.data)
#         if serializer.is_valid():
            
#             expense = serializer.save(created_by=request.user, house_id=house_id)
#             # criar ExpenseShares aqui, se necessário
#             return Response(ExpenseSerializer(expense).data, status=status.HTTP_201_CREATED)
#         print(serializer.errors) 
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def expense_detail(request, pk):
    try:
        expense = Expense.objects.get(pk=pk)
    except Expense.DoesNotExist:
        return Response({'error': 'Despesa não encontrada'}, status=404)

    # Verifica se o user pertence à casa da despesa
    # if not request.user.housemembership_set.filter(house=expense.house).exists():
    #     return Response({'error': 'Sem permissão'}, status=403)

    if request.method == 'GET':
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        expense.delete()
        return Response(status=204)


# pro user dizer que ja pagou (só a parte dele)
# @api_view(['PATCH']) # Patch atualização parcial so altera o estado pra pago
# @permission_classes([IsAuthenticated])
# def mark_expense_share_paid(request, pk):
#     try:
#         share = ExpenseShare.objects.get(pk=pk, user=request.user)
#     except ExpenseShare.DoesNotExist:
#         return Response({'error': 'Share não encontrado ou acesso negado'}, status=status.HTTP_404_NOT_FOUND)

#     # Atualizar só o campo paid para True user respetivo
#     share.paid = True
#     share.save()
#     serializer = ExpenseShareSerializer(share)
#     return Response(serializer.data)



# @api_view(['POST'])
# @permission_classes([IsAuthenticated])  # <- esta linha é ESSENCIAL
# def mark_expense_share_paid(request, pk):
#     print(f"User: {request.user}, pk: {pk}")
#     try:
        
#         expenseshare = ExpenseShare.objects.get(pk=pk)
#         print(f"Expense found: {expenseshare}")
        
#     except ExpenseShare.DoesNotExist:
#         print('errrrrrrro4')
#         return Response({'detail': 'Despesa não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    

#     expenseshare.paid = True
#     expenseshare.save()
#     print(f"Estado atualizado: {expenseshare.paid}")
#     serializer = ExpenseShareSerializer(expenseshare)
#     return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_expense_share_paid(request, pk):
    try:
        expenseshare = ExpenseShare.objects.get(pk=pk)
    except ExpenseShare.DoesNotExist:
        return Response({'detail': 'Despesa não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Verifica se o user autenticado é o dono da share
    if expenseshare.user != request.user:
        return Response({'detail': 'Não autorizado.'}, status=status.HTTP_403_FORBIDDEN)

    expenseshare.paid = True
    expenseshare.save()
    
    serializer = ExpenseShareSerializer(expenseshare)
    return Response(serializer.data)

    #VER SALDO 





    # task.status = 'completed'
    # task.completed_at = timezone.now()
    # task.completed_by = request.user
    # task.save()

    # return Response({'detail': 'Tarefa concluída com sucesso!'}, status=status.HTTP_200_OK)







# por causa da cena de ver o saldo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_balance(request):
    user = request.user
    shares = ExpenseShare.objects.filter(user=user)
    print ('olaaaaaaaa')
    total_due = Decimal('0.00')
    total_paid = Decimal('0.00')

    for share in shares:
        total_due += share.amount_due
        if share.paid:
            total_paid += share.amount_due

    saldo = total_due - total_paid
    print (saldo)

    return Response({
        'total_due': total_due,
        'total_paid': total_paid,
        'balance': saldo,
    })
    