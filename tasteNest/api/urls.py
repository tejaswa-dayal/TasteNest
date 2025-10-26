
from django.urls import path
from .views import get_user, remove_dish_from_cart,sign_up_user,authenticate_user,get_reservations, create_reservation,get_dishes,add_to_or_update_cart, place_order, get_cart_items, get_orders

urlpatterns = [
    path('users/',get_user,name="get_users"),
    path('users/sign-up/',sign_up_user, name="sign_up"),
    path('users/login/',authenticate_user, name="login"),
    path('users/get-reservations/',get_reservations,name="get_reservations"),
    path('users/create-reservations/',create_reservation,name="create_reservation"),
    path('dishes/get-dishes/',get_dishes,name='get_dishes'),
    path('cart/add-to-or-update-cart/',add_to_or_update_cart,name='add_to_or_update_cart'),
    path('cart/remove-dish-from-cart/',remove_dish_from_cart,name='remove_dish_from_cart'),
    path('cart/get-cart-items/',get_cart_items,name='get_cart_items'),
    path('orders/place-order/',place_order,name='place_order'),
    path('orders/get-orders/',get_orders,name='get_orders'),
]