from django.urls import path
from . import views


urlpatterns = [
    # Listar e criar despesas
    path('expenses/', views.expenses_list_create, name='expenses_list_create'),

    # Detalhes, atualizar e apagar despesa específica
    path('expenses/<int:pk>/', views.expense_detail, name='expense_detail'),

    # Listar as partes da despesa do utilizador (shares)
    path('shares/', views.user_shares_list, name='user_shares_list'),

    # Marcar parte (do roomie) da despesa como paga 
    path('shares/<int:pk>/pay/', views.mark_expense_share_paid, name='mark_expense_share_paid'),
    
    # ver o saldo (pode aparecer logo no dashboard) 
    path('balance/', views.user_balance, name='user_balance'),
]