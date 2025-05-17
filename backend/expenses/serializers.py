from rest_framework import serializers
from .models import Expense, ExpenseShare


# ver os campos dps 

class ExpenseShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseShare
        fields = '__all__'

# class ExpenseSerializer(serializers.ModelSerializer):
#     shares = ExpenseShareSerializer(many=True, read_only=True)  # ou required=False se for para escrita

#     class Meta:
#         model = Expense
#         fields = '__all__'
#         #read_only_fields = ['created_by']  # normalmente queres que este seja só leitura


class ExpenseSerializer(serializers.ModelSerializer):
    shares = ExpenseShareSerializer(many=True, read_only=True)  # ou required=False se for para escrita

    created_by_username = serializers.ReadOnlyField(source='created_by.username', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'house', 'title', 'amount', 'date', 'created_by', 'created_by_username', 'shares']
        read_only_fields = ['id', 'created_by', 'created_by_username']  # <-- adiciona isto


    #     house = models.ForeignKey(House, on_delete=models.CASCADE, related_name='expenses')
    # created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')
    # title = models.CharField(max_length=200)
    # amount = models.DecimalField(max_digits=10, decimal_places=2)
    # date = models.DateField()
    # description = models.TextField(blank=True)
    # created_at = models.DateTimeField(auto_now_add=True)

    # #agua luz comida etc? tabela a parte?
    # category = models.CharField(max_length=50)  # nova categoria

    # def __str__(self):
    #     return f"{self.title} - {self.amount}€"
