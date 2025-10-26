from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User,Reservations,Dish, Cart, CartItem, Order, OrderItem
from .serializer import UserSerializer, ReservationSerializer, DishSerializer, OrderSerializer, OrderItemSerializer, CartItemSerializer
from django.contrib.auth.hashers import make_password,check_password
from .serializer import format_serializer_errors
from collections import defaultdict


# Create your views here.
@api_view(['GET'])
def get_user(request):
    users = User.objects.all()
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def sign_up_user(request):
    form_data = {
        "name" : request.data.get("name"),
        "email" : request.data.get("email"),
        "password" : make_password(request.data.get("password")),
    }
    serialized_data = UserSerializer(data=form_data)
    if serialized_data.is_valid():
        serialized_data.save()
        return Response("Sign-up successful.",status=status.HTTP_201_CREATED)
    return Response(format_serializer_errors(serialized_data).capitalize(), status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def authenticate_user(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if User.objects.filter(email=email).exists() and check_password(password,User.objects.get(email=email).password):
        name = User.objects.get(email=email).name
        user_id = User.objects.get(email=email).user_id
        if " " in name:
            return Response({"name": name[:name.index(" ")], "user_id" : user_id} , status=status.HTTP_200_OK)
        else:
            return Response({"name": name, "user_id" : user_id} , status=status.HTTP_200_OK)
    return Response("Invalid email or password.",status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_reservations(request):
    user_id = request.query_params.get("user")
    try:
        customer = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    total_reservations = Reservations.objects.filter(customer=customer)
    if total_reservations:
        return Response(list(total_reservations.values()), status=status.HTTP_200_OK)
    else:
        return Response("No reservations found.", status=status.HTTP_200_OK)

@api_view(['POST'])
def create_reservation(request):
    user_id = request.data.get("user_id")
    try:
        customer = User.objects.get(user_id = user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    reservation_data = {
        "booked_for_date": request.data.get('date'),
        "time" : request.data.get("time"),
        "no_of_guests" : request.data.get("guests")
    }
    serialized_reservation_data = ReservationSerializer(data=reservation_data)
    
    if serialized_reservation_data.is_valid():
        serialized_reservation_data.save(customer=customer)
        return Response("Reservation Successful!",status=status.HTTP_201_CREATED)
    else:
        return Response(format_serializer_errors(serialized_reservation_data).capitalize(), status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
def get_dishes(request):
    featured = request.query_params.get('featured',False)
    if featured:
        featured_dishes = Dish.objects.filter(featured=True)
        if not featured_dishes.exists():
            return Response("No Featured Dishes.",status=status.HTTP_200_OK)
        else:
            return Response(DishSerializer(featured_dishes,many=True).data,status=status.HTTP_200_OK)
    else:
        dishes = Dish.objects.all()
        serialized_dish_data = DishSerializer(dishes,many=True)
        grouped_dishes = defaultdict(list)
        for dish in serialized_dish_data.data:
            grouped_dishes[dish['category']].append(dish)
        if len(grouped_dishes)==0:
            return Response("No Dishes Found!",status=status.HTTP_200_OK)
        else:
            return Response(grouped_dishes,status=status.HTTP_200_OK)
    
@api_view(['PUT'])
def add_to_or_update_cart(request):
    customer_id = request.data.get('customer')
    dish_id = request.data.get('dish_id')
    quantity = request.data.get('quantity')
    if not quantity or int(quantity)<=0:
        quantity = 1
    if not customer_id or not dish_id:
        return Response({'error': 'customer and dish_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate customer and dish existence
    try:
        customer = User.objects.get(user_id=customer_id)
        dish = Dish.objects.get(dish_id=dish_id)
    except User.DoesNotExist:
        return Response({'error': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Dish.DoesNotExist:
        return Response({'error': 'Dish not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Get or create cart for the customer
    cart, _ = Cart.objects.get_or_create(customer=customer)

    # Check if dish already in cart
    cart_item, created = CartItem.objects.get_or_create(cart=cart, dish=dish)

    if not created:
        cart_item.quantity = quantity
        cart_item.save()
        return Response({'message': 'Quantity updated successfully.'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Item added to cart successfully.'}, status=status.HTTP_201_CREATED)
    
@api_view(['DELETE'])
def remove_dish_from_cart(request):
    customer_id = request.data.get('customer')
    dish_id = request.data.get('dish')
    if not customer_id or not dish_id:
        return Response({'error': 'customer and dish_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        customer = User.objects.get(user_id = customer_id)
        dish = Dish.objects.get(dish_id=dish_id)
    except User.DoesNotExist:
        return Response({'error': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Dish.DoesNotExist:
        return Response({'error': 'Dish not found.'}, status=status.HTTP_404_NOT_FOUND)
    try:
        cart = Cart.objects.get(customer=customer)
    except Cart.DoesNotExist:
        return Response({'error': 'No cart found.'}, status=status.HTTP_404_NOT_FOUND)

    deleted_count, _ = CartItem.objects.filter(cart=cart, dish=dish).delete()
    if deleted_count > 0:
        return Response({"message": "Successfully removed item from cart."})
    else:
        return Response(
            {"error": "Dish not found in cart."},
            status=status.HTTP_404_NOT_FOUND,
        )

@api_view(['GET'])
def get_cart_items(request):
    customer_id = request.query_params.get('user')
    if not customer_id:
        return Response({'error': 'Customer ID is required.'},status=status.HTTP_400_BAD_REQUEST)
    try:
        customer = User.objects.get(user_id=customer_id)
        cart = Cart.objects.get(customer = customer)
    except User.DoesNotExist:
        return Response({'error': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Cart.DoesNotExist:
        return Response({'error': 'No cart found.'}, status=status.HTTP_404_NOT_FOUND)
    cart_items = CartItem.objects.filter(cart=cart)
    if cart_items.exists():
        serialized_cart_items = CartItemSerializer(cart_items,many=True)
        dishes = []
        for item in serialized_cart_items.data:
            dish_instance = Dish.objects.get(dish_id = item['dish'])
            dish_data = DishSerializer(dish_instance).data
            dishes.append({
                "dish_id" : dish_data['dish_id'],
                "name" : dish_data['name'],
                "category" : dish_data['category'],
                "price": dish_data['price'],
                'discounted_price': dish_data['discounted_price'],
                "dish_image": dish_data['dish_image'],
                "quantity": item['quantity'],
                "featured": dish_data['featured'],
            })
        return Response(dishes,status=status.HTTP_200_OK)
    else:
        return Response("No items in cart",status=status.HTTP_200_OK)

@api_view(['POST'])
def place_order(request):
    customer_id = request.data.get('customer')
    payment_method = request.data.get('payment_method')
    address = request.data.get('address')
    total_amount = request.data.get('total_amount')
    if not customer_id or not payment_method or not address or not total_amount:
        return Response({'error': 'Customer, Dishes, Payment method, Total Amount and Address are required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        customer = User.objects.get(user_id=customer_id)
        cart = Cart.objects.get(customer=customer)
    except User.DoesNotExist:
        return Response({'error': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Cart.DoesNotExist:
        return Response({'error': 'No cart found.'}, status=status.HTTP_404_NOT_FOUND)
    order_data = {
        "customer" : customer.user_id,
        "total_amount":float(total_amount),
        "address": address,
        "payment_method":payment_method
    }
    serialized_order_data = OrderSerializer(data=order_data)
    if serialized_order_data.is_valid():
        order_instance = serialized_order_data.save()
        cart_items = CartItem.objects.filter(cart=cart)
        order_creation_success = True
        for item in cart_items:
            order_item_data = {
                "order":order_instance.order_id,
                "dish" : item.dish.dish_id,
                "quantity": item.quantity
            }
            serialized_order_item_data = OrderItemSerializer(data=order_item_data)
            if serialized_order_item_data.is_valid():
                serialized_order_item_data.save()
            else:
                order_creation_success = False
                break
            # 
        if order_creation_success:
            cart.delete()
            return Response("Order placed successfully!",status=status.HTTP_201_CREATED)
        else:
            order_instance.delete()
            return Response(format_serializer_errors(serialized_order_item_data).capitalize(),status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(format_serializer_errors(serialized_order_data).capitalize(),status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_orders(request):
    customer_id = request.query_params.get('user')
    try:
        customer = User.objects.get(user_id=customer_id)
    except User.DoesNotExist:
        return Response({'error': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)
    orders = Order.objects.filter(customer=customer)
    if orders.exists():
        serialized_orders = OrderSerializer(orders,many=True)
        for order in serialized_orders.data:
            order_items = OrderItem.objects.filter(order=order['order_id'])
            serialized_order_items = OrderItemSerializer(order_items,many=True)
            dishes=[]
            for item in serialized_order_items.data:
                dish_instance = Dish.objects.get(dish_id=item['dish'])
                dish_data = DishSerializer(dish_instance).data
                dishes.append({
                "dish_id" : dish_data['dish_id'],
                "name" : dish_data['name'],
                "category" : dish_data['category'],
                "price": dish_data['price'],
                'discounted_price': dish_data['discounted_price'],
                "dish_image": dish_data['dish_image'],
                "quantity": item['quantity'],
                "featured": dish_data['featured'],
            })
            order['dishes'] = dishes
        return Response(serialized_orders.data,status=status.HTTP_200_OK)
    else:
        return Response("No orders found.",status=status.HTTP_200_OK)
    