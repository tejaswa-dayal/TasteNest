from django.contrib import admin
from .models import User,Reservations,Dish,Cart,CartItem,Order,OrderItem

# Register your models here.
admin.site.register([User,Reservations,Dish,CartItem,Cart,Order,OrderItem])