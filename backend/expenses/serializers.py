from rest_framework import serializers
from .models import Expense, ExpenseShare


# ver os campos dps 

class ExpenseShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseShare
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    shares = ExpenseShareSerializer(many=True, read_only=True)  # ou required=False se for para escrita

    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['created_by']  # normalmente queres que este seja só leitura