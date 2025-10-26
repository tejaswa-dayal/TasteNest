from django.db import models
import uuid

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100,unique=True,null=False,blank=False)
    password = models.CharField(max_length=100,null=False,blank=False)
    user_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)

    def __str__(self):
        return str(self.user_id)
    
class Reservations(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    booked_for_date = models.DateField(null=False, blank=False)
    time = models.TimeField(null=False, blank=False)
    no_of_guests = models.PositiveIntegerField(null=False, blank=False)
    booked_on_date = models.DateField(null=False, blank=False,auto_now=True)
    reservation_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    
    class Meta:
        verbose_name_plural = "Reservations"

    def __str__(self):
        return str(self.reservation_id)

class CategoryChoices(models.TextChoices):
    BREAKFAST = "Breakfast"
    LUNCH = "Lunch"
    DINNER = "Dinner"    

class Dish(models.Model):
    name = models.CharField(max_length=100,null=False,blank=False,unique=True)
    dish_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,auto_created=True)
    category = models.CharField(max_length=10,
        choices=CategoryChoices.choices
    )
    price = models.PositiveIntegerField(null=False,blank=False)
    discounted_price = models.PositiveIntegerField(null=True,blank=True)
    dish_image = models.ImageField()
    featured = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Dish"
        verbose_name_plural = "Dishes"

    def __str__(self):
        return self.name

class Cart(models.Model) :
    cart_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,auto_created=True)
    customer = models.ForeignKey(User,on_delete=models.CASCADE)

class CartItem(models.Model):
    cart_item_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,auto_created=True)
    dish = models.ForeignKey(Dish,on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)


class Order(models.Model):
    order_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,auto_created=True)
    customer = models.ForeignKey(User,on_delete=models.CASCADE)
    ordered_on = models.DateField(auto_now=True)
    total_amount = models.FloatField(null=False,blank=False)
    address = models.TextField(null=False,blank=False)
    payment_method = models.CharField(max_length=50,null=False,blank=False)

class OrderItem(models.Model):
    order_item_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,auto_created=True)
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
