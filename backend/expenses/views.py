from decimal import Decimal
from django.shortcuts import render
from requests import Response

from backend.expenses.serializers import ExpenseSerializer, ExpenseShareSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Expense, ExpenseShare
from .serializers import ExpenseShareSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])


# no frontend ele escolhe se quer dividir igual (automatico) ou personalizado mas só muda o JSON enviado (calcula os valores no frontend do js) o código é igual

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def expenses_list_create(request):
    user = request.user

    # ver isto
    if request.method == 'GET':
        houses = [m.house for m in user.housemembership_set.all()]
        expenses = Expense.objects.filter(house__in=houses).order_by('-date')
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data

        assigned_roomies = data.get('assigned_roomies', [])

        if not assigned_roomies:
            return Response({'error': 'Deves indicar pelo menos um Roomie para esta despesa'}, status=400)

        total_amount = Decimal(str(data.get('amount')))
        total_due = sum(Decimal(str(share['amount_due'])) for share in assigned_roomies) # vai buscar os roomies assigned e os valores q cada um paga

        # se ele vai dizer manualmente a divisao tem  a bater certo com o total (isto ta a ser visto no frontend supostamente)
        if total_due != total_amount:
            return Response({'error': 'A soma dos valores atribuídos não bate com o total'}, status=400)

        # Verifica que o user é admin da casa
        house_id = data.get('house')
        # if not HouseMembership.objects.filter(user=user, house_id=house_id, role='admin').exists():
        #     return Response({'error': 'Só admins podem criar despesas'}, status=403)

        expense_data = {
            'house': house_id,
            'created_by': user.id,
            'title': data.get('title'),
            'category': data.get('category'),
            'amount': total_amount,
            'date': data.get('date'),
            'description': data.get('description', ''),
        }

        expense_serializer = ExpenseSerializer(data=expense_data)
        if not expense_serializer.is_valid():
            return Response(expense_serializer.errors, status=400)
        expense = expense_serializer.save()

        for share in assigned_roomies:
            # if not HouseMembership.objects.filter(user_id=share['user'], house_id=house_id).exists():
            #     expense.delete()
            #     return Response({'error': f"User {share['user']} não pertence a casa"}, status=400)
            share['expense'] = expense.id
            share['paid'] = False
            share_serializer = ExpenseShareSerializer(data=share)
            if not share_serializer.is_valid():
                expense.delete()
                return Response(share_serializer.errors, status=400)
            share_serializer.save()

        return Response(ExpenseSerializer(expense).data, status=201)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def expense_detail(request, pk):
    try:
        expense = Expense.objects.get(pk=pk)
    except Expense.DoesNotExist:
        return Response({'error': 'Despesa não encontrada'}, status=404)

    # Verifica se o user pertence à casa da despesa
    if not request.user.housemembership_set.filter(house=expense.house).exists():
        return Response({'error': 'Sem permissão'}, status=403)

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
@api_view(['PATCH']) # Patch atualização parcial so altera o estado pra pago
@permission_classes([IsAuthenticated])
def mark_expense_share_paid(request, pk):
    try:
        share = ExpenseShare.objects.get(pk=pk, user=request.user)
    except ExpenseShare.DoesNotExist:
        return Response({'error': 'Share não encontrado ou acesso negado'}, status=status.HTTP_404_NOT_FOUND)

    # Atualizar só o campo paid para True user respetivo
    share.paid = True
    share.save()
    serializer = ExpenseShareSerializer(share)
    return Response(serializer.data)



# por causa da cena de ver o saldo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_balance(request):
    user = request.user
    shares = ExpenseShare.objects.filter(user=user)

    total_due = Decimal('0.00')
    total_paid = Decimal('0.00')

    for share in shares:
        total_due += share.amount_due
        if share.paid:
            total_paid += share.amount_due

    saldo = total_due - total_paid

    return Response({
        'total_due': total_due,
        'total_paid': total_paid,
        'balance': saldo,
    })