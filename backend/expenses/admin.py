from django.contrib import admin
from .models import ExpenseShare, Expense

admin.site.register(Expense)
#admin.site.register(HouseMembership)
admin.site.register(ExpenseShare)