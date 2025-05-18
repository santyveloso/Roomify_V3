from rest_framework import serializers
from .models import Expense, ExpenseShare

from django.contrib.auth import get_user_model

User = get_user_model()

# ver os campos dps 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')  # ou outros campos que queiras expor


class ExpenseShareSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    # user = UserSerializer(read_only=True) # inclui dados do user
    user_name = serializers.CharField(source='user.username', read_only=True)  # para conveniência no frontend
    user_id = serializers.IntegerField(source='user.profile.id', read_only=True)
    

    class Meta:
        model = ExpenseShare
        
        fields = ('id', 'user','user_id','user_name', 'amount_due', 'paid', 'expense')



class ExpenseSerializer(serializers.ModelSerializer):
    shares = ExpenseShareSerializer(source='assigned_roomies', many=True, read_only=True)
    created_by_username = serializers.ReadOnlyField(source='created_by.username', read_only=True)
    all_paid = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = [
            'id', 'house', 'title', 'category',  
            'amount', 'date', 'description', 'created_by',
            'created_by_username', 'shares', 'all_paid',
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username']


    def get_all_paid(self, obj):
        return obj.all_paid

# class ExpenseSerializer(serializers.ModelSerializer):
#     shares = ExpenseShareSerializer(many=True, read_only=True)  # ou required=False se for para escrita

#     class Meta:
#         model = Expense
#         fields = '__all__'
#         #read_only_fields = ['created_by']  # normalmente queres que este seja só leitura




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
