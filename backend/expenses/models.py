from django.db import models
from houses.models import House
from django.conf import settings  

# vamos ignorar as despesas recorrentes pfv 

class Expense(models.Model):
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name='expenses')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    #agua luz comida etc? tabela a parte?
    category = models.CharField(max_length=50)  # nova categoria

    def __str__(self):
        return f"{self.title} - {self.amount}€"

   


# tabela associativa entre o user e a expense (porque dissemos que ia ser dinamico quanto pagam e divisoes)
class ExpenseShare(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='assigned_roomies')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField(default=False)