// import  { useState, useEffect } from 'react'
import { Container } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../redux/store/store';
import { Link } from 'react-router-dom';
import { addOrUpdateCart, removeDishFromCart, removeFromCart, type InCartDishData,updateQuantityOfDishInCart } from '../redux/features/Cart/cartSlice';
import { useDebounce } from '../hooks/useDebounce';
import { useState } from 'react';
import toast from 'react-hot-toast';



const Cart = () => {
    const [discount, setDiscount] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const {user_id} = useSelector((state:RootState)=>state.logIn)
    const {dishes, dishesInCartCount} = useSelector((state:RootState)=>state.cart)
    const debouncedIncreaseDishQuantityInCart = useDebounce((payload)=>dispatch(addOrUpdateCart(payload)));
    const debouncedDecreaseDishQuantityInCart = useDebounce((payload)=>dispatch(addOrUpdateCart(payload)));
    const debouncedRemoveDishFromCart = useDebounce((payload)=>dispatch(removeDishFromCart(payload)));
    const handleQuantityIncrease = (dish_id : string) => {
         const dish =dishes.find(d => d.dish_id === dish_id);
        const newQuantity = dish?.quantity? Number(dish.quantity) + 1 : 1;
        dispatch(updateQuantityOfDishInCart({"dish_id" : dish_id, "newQuantity": newQuantity}));
        debouncedIncreaseDishQuantityInCart({"dish_id":dish_id,"customer":user_id as string,"quantity":String(newQuantity)});
    }

    const handleRemoveDishFromCart = (dish : InCartDishData) =>{
        dispatch(removeFromCart(dish));
      debouncedRemoveDishFromCart({"dish":dish.dish_id,"customer":user_id as string});
    }

    const handleQuantityDecrease = (dish : InCartDishData) => {
        if(dish.quantity === "1"){
            handleRemoveDishFromCart(dish);
        }
        else{
            const newQuantity = Number(dish.quantity) - 1;
        dispatch(updateQuantityOfDishInCart({"dish_id" : dish.dish_id, "newQuantity": newQuantity}));
        debouncedDecreaseDishQuantityInCart({"dish_id":dish.dish_id,"customer":user_id as string,"quantity":String(newQuantity)})
    }
    }
    
    const handleApplyPromoCode = ()=> {
        const availablePromoCodes: Record<string,string> = {
            "SAVE10" : "10",
            "SAVE20" : "20",
            "FIRST15" : "15"
        }
        if (promoCode){
        if(availablePromoCodes[promoCode]){
            setDiscount(availablePromoCodes[promoCode])
            toast.success(`${promoCode} promo code applied successfully.`);
        }
        else{
            toast.error("Invalid promo code.")
            setPromoCode('');
        }
        }
        else{
        toast.error("Enter a promo code to apply.")
    }
}

    let totalCartValue = 0;
    dishes.forEach((dish)=>{
        totalCartValue  = totalCartValue + ((dish.discounted_price ? Number(dish.discounted_price) : Number(dish.price))*Number(dish.quantity))
    })

  return (
    <div className='min-h-[80vh] pt-18 bg-(--gray-light)/30'>
    <Container>
      <div className='flex flex-col gap-8 pb-8'>
         <h1 className='text-center text-6xl text-(--primary-color) relative max-sm:text-4xl font-Oswald' data-aos="fade-down">
            Ca<span className='before:content-[""] before:w-12 max-sm:before:w-8 before:h-1 before:absolute before:-bottom-1 before:bg-(--secondary-color) before:rounded-lg'>rt</span>
         </h1>

         {!user_id ? (
            <div className='flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-lg'>
                <div className='text-8xl mb-4' data-aos="fade-right">🛒</div>
                <h2 className='text-2xl text-(--gray-dark) font-Oswald mb-2' data-aos="fade-left">Login to view your cart</h2>
                <Link to='/login' className='mt-4 px-6 py-3 bg-(--primary-color) text-white rounded-lg font-semibold hover:bg-(--primary-color)/90 transition-all duration-300 hover:scale-105' data-aos="fade-up">
                    Login Now
                </Link>
            </div>
         ) : dishesInCartCount === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-lg'>
                <div className='text-8xl mb-4' data-aos="fade-right">🛒</div>
                <h2 className='text-2xl text-(--gray-dark) font-Oswald mb-2' data-aos="fade-left">Your cart is empty</h2>
                <p className='text-(--gray-dark) mb-6' data-aos="zoom-in">Add some delicious items to get started!</p>
                <Link to='/menu' className='px-6 py-3 bg-(--primary-color) text-white rounded-lg font-semibold hover:bg-(--primary-color)/90 transition-all duration-300 hover:scale-105' data-aos="fade-up">
                    Browse Menu
                </Link>
            </div>
         ) : (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <div className='col-span-2 flex flex-col gap-4'>
                    <div className='bg-white shadow-2xl p-4 rounded-xl flex flex-col gap-2' data-aos="fade-down">
                        <h2 className='text-2xl font-Oswald text-(--black-color) mb-4 flex items-center gap-2'>
                            <span className='text-3xl'>🛍️</span>
                            Cart Items ({dishesInCartCount})
                        </h2>
                        {
                            dishes.map((dish)=>(
                                <div className='flex flex-col md:flex-row items-center justify-between gap-3  bg-white border border-(--gray-light)/80 p-2 rounded-sm shadow-lg' key={dish.dish_id}>
                                    <div className='flex flex-col md:flex-row items-center gap-2'>
                                    <img src={dish.dish_image} alt="" className='w-60 h-30 md:w-24 md:h-24 rounded-lg border-2 border-(--gray-light)/80'/>
                                    <div className='flex flex-col gap-2 items-center md:items-start'>
                                        <p className='font-semibold text-lg capitalize'>{dish.name}</p>
                                        <div className='flex gap-2 flex-wrap items-center'>
                                            <div className='px-2 py-1 bg-(--gray-light) rounded-full text-xs capitalize'>
                                                {dish.category}
                                            </div>
                                            {
                                                dish.featured && <div className='px-2 py-1 bg-(--primary-color) rounded-full text-xs text-white group'>
                                                <span className='inline-block group-hover:rotate-y-180 group-hover:scale-150 transition-all duration-700'>⭐</span> Featured
                                            </div>
                                            }
                                            
                                        </div>
                                    </div>
                                    </div>

                                    <div className='flex flex-col gap-2 items-center'>
                                        <p className='text-sm text-(--gray-dark)'>Price</p>
                                        <div className='flex md:flex-col gap-2 items-center'>

                                        {
                                            dish.discounted_price && <p className='text-(--primary-color) font-semibold'>₹{dish.discounted_price}</p>
                                        }
                                        <p className={`${dish.discounted_price ? "text-(--gray-dark) line-through text-sm decoration-2" : 'font-semibold text-(--primary-color)'}`}>₹{dish.price}</p>
                                        </div>
                                    </div>
                                    <div className='flex gap-2.5 justify-center items-center'>
                                        <button className='font-semibold bg-(--gray-light) rounded-full w-10 h-10 cursor-pointer hover:bg-(--primary-color) hover:text-white' type='button' onClick={()=> handleQuantityDecrease(dish)}>
                                            -
                                        </button>
                                        <span className='text-xl'>
                                            {dish.quantity}
                                        </span>
                                        <button className='font-semibold bg-(--gray-light) rounded-full w-10 h-10 cursor-pointer hover:bg-(--primary-color) hover:text-white' type='button' onClick={()=> handleQuantityIncrease(dish.dish_id)}>
                                            +
                                        </button>
                                    </div>
                                    <div className='flex flex-col gap-2.5 justify-center items-center'>
                                        <span className='font-semibold text-(--black-color) text-2xl'>
                                            ₹{Number(dish.quantity) * (dish.discounted_price ? Number(dish.discounted_price) : Number(dish.price))}
                                        </span>
                                        <button className='text-(--primary-color) text-lg cursor-pointer hover:scale-105 hover:font-semibold transition-all duration-500' onClick={()=> handleRemoveDishFromCart(dish)} type='button'>Remove</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='bg-white shadow-2xl p-4 rounded-xl flex flex-col gap-2' data-aos="fade-up">
                        <h2 className='text-xl font-Oswald text-(--black-color) mb-4 flex items-center gap-2'>
                            <span className='text-2xl'>🎟️</span>
                            Apply Promo Code
                        </h2>
                        <div className='flex gap-2'>
                            <input type="text"
                            value={promoCode}
                            placeholder='Enter Promo Code'
                            onChange={(e)=>setPromoCode(e.target.value)}
                            className='flex-1 px-4 py-2 border-2 border-(--gray-light) rounded-lg focus:outline-none focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/20 transition-all'/>
                            <button className='bg-(--green-dark)/80 text-white tracking-wider font-semibold rounded-lg px-4 py-1 hover:bg-(--green-dark) transition-all duration-500 cursor-pointer'
                            onClick={handleApplyPromoCode}
                            >
                            Apply
                            </button>
                        </div>
                        <div className='h-[0.01rem] w-full pt-[0.1rem] bg-(--gray-dark)/40 rounded-2xl mt-1 shadow-2xl'/>
                        <p className='text-xs text-(--gray-dark)/70'>Available Codes:</p>
                            <div className='flex flex-wrap gap-3 text-(--black-color) text-xs uppercase font-semibold'>
                                <button className='bg-(--secondary-color)/30  px-2 py-1 rounded-lg cursor-pointer hover:bg-(--secondary-color)/80 transition-colors duration-500' onClick={()=>setPromoCode("SAVE10")}>
                                    SAVE10 - 10% OFF
                                </button>
                                <button className='bg-(--secondary-color)/30  px-2 py-1 rounded-lg cursor-pointer hover:bg-(--secondary-color)/80 transition-colors duration-500' onClick={()=>setPromoCode("SAVE20")}>
                                    SAVE20 - 20% OFF
                                </button>
                                <button className='bg-(--secondary-color)/30  px-2 py-1 rounded-lg cursor-pointer hover:bg-(--secondary-color)/80 transition-colors duration-500' onClick={()=>setPromoCode("FIRST15")}>
                                    FIRST15 - 15% OFF
                                </button>
                            </div>
                        </div>

                </div>
                <div className='col-span-1 bg-white shadow-2xl p-4 rounded-xl flex flex-col gap-2 max-h-145' data-aos="fade-left">
                    <h2 className='text-2xl font-Oswald text-(--black-color) mb-4 flex items-center gap-2'>
                            <span className='text-3xl'>📋</span>
                            Order Summary
                        </h2>
                    <div className='flex flex-col gap-3.5 w-full px-2 text-lg'>
                        <div className='flex justify-between'>
                        <h6 className=' text-(--gray-dark)/80'>Subtotal</h6>
                        <p className=''>₹{(totalCartValue.toFixed(2))}</p>
                        </div>

                        {
                            discount && <div className='flex justify-between text-(--green-dark) text-lg'>
                                <h6 className=''>Discount ({discount}%)</h6>
                            <p className=''>-₹{(totalCartValue * (Number(discount)/100)).toFixed(2)}</p>
                            </div>
                        }

                        <div className='flex justify-between'>
                            <h6 className=' text-(--gray-dark)/80'>Tax(8%)</h6>
                            <p className=''>₹{(totalCartValue * 0.08).toFixed(2)}</p>
                        </div>
                        <div className='h-[0.01rem] w-full pt-[0.1rem] bg-(--gray-dark)/40 rounded-2xl mt-1 shadow-2xl'/>
                        <div className='flex justify-between'>
                            <h6 className='text-xl font-semibold'>Total</h6>
                            <p className='text-(--primary-color) font-semibold text-xl'>₹{((totalCartValue * 0.08) + Number(totalCartValue.toFixed(2)) - (Number(totalCartValue) * (Number(discount)/100))).toFixed(2)}</p>
                        </div>
                        <div className='w-full grow flex flex-col gap-5'>
                        <Link to={`/checkout?d=${promoCode}`} className='mt-4'>
                        <button className='bg-(--primary-color)/85 px-4 py-2 rounded-lg text-white font-semibold w-full cursor-pointer hover:bg-(--primary-color) transition-colors duration-500 '>
                            Proceed to Checkout
                        </button>
                        </Link>
                                                <Link to={'/menu'}>
                        <button className='border-2 border-(--primary-color) px-4 py-2 rounded-lg text-(--primary-color) font-semibold cursor-pointer w-full  hover:bg-(--primary-color) hover:text-white transition-colors duration-500'>
                            Continue Shopping
                        </button>
                        </Link>
                        </div>
                        <div className='h-[0.01rem] w-full pt-[0.1rem] bg-(--gray-dark)/40 rounded-2xl mt-4 shadow-2xl'/>
                        <div className='w-full flex flex-col items-center pt-3 mb-2'>
                            <p className='text-sm text-(--gray-dark)/80'>We accept</p>
                        </div>
                        <div className='flex justify-center gap-4 w-full flex-wrap pb-2'>
                            <div className='bg-(--gray-light) px-3 py-1 font-semibold text-xs rounded'>
                                💳 Card
                            </div>
                            <div className='bg-(--gray-light) px-3 py-1 font-semibold text-xs rounded'>
                                📱 UPI
                            </div>
                            <div className='bg-(--gray-light) px-3 py-1 font-semibold text-xs rounded'>
                                💰 COD
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         )}
      </div>
    </Container>
    </div>
  )
}

export default Cart



/*
<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                 Cart Items Section *
                <div className='lg:col-span-2 flex flex-col gap-4'>
                    <div className='bg-white rounded-xl shadow-lg p-4'>
                        <h2 className='text-2xl font-Oswald text-(--black-color) mb-4 flex items-center gap-2'>
                            <span className='text-3xl'>🛍️</span>
                            Cart Items ({dishesInCartCount})
                        </h2>
                        
                        <div className='flex flex-col gap-4'>
                            {cartItems.map((item) => {
                                const displayQuantity = itemQuantities[item.dish_id] || item.quantity;
                                const itemPrice = item.discounted_price ? parseFloat(item.discounted_price) : parseFloat(item.price);
                                const hasDiscount = item.discounted_price && parseFloat(item.discounted_price) < parseFloat(item.price);

                                return (
                                    <div key={item.dish_id} className='border border-(--gray-light) rounded-lg p-4 hover:shadow-md transition-shadow duration-300 group'>
                                        <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
                                            Image and Name 
                                            <div className='md:col-span-5 flex items-center gap-4'>
                                                <img 
                                                    src={item.dish_image || "/FormImage.png"} 
                                                    alt={item.name} 
                                                    className='w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-2 border-(--gray-light) group-hover:border-(--secondary-color) transition-colors'
                                                />
                                                <div>
                                                    <h3 className='text-lg md:text-xl font-semibold text-(--black-color)'>{item.name}</h3>
                                                    {item.category && (
                                                        <span className='text-xs text-(--gray-dark) bg-(--gray-light) px-2 py-1 rounded-full mt-1 inline-block'>
                                                            {item.category}
                                                        </span>
                                                    )}
                                                    {item.featured && (
                                                        <span className='text-xs text-white bg-(--primary-color) px-2 py-1 rounded-full ml-2'>
                                                            ⭐ Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            Price 
                                            <div className='md:col-span-2 text-center'>
                                                <p className='text-sm text-(--gray-dark) mb-1'>Price</p>
                                                {hasDiscount ? (
                                                    <div>
                                                        <p className='text-lg font-bold text-(--primary-color)'>₹{itemPrice}</p>
                                                        <p className='text-sm text-(--gray-dark) line-through'>₹{parseFloat(item.price)}</p>
                                                    </div>
                                                ) : (
                                                    <p className='text-xl font-bold text-(--primary-color)'>₹{itemPrice}</p>
                                                )}
                                            </div>

                                             Quantity Controls *
                                            <div className='md:col-span-3 flex items-center justify-center gap-3'>
                                                <button 
                                                    onClick={() => handleQuantityDecrease(item)}
                                                    className='w-8 h-8 rounded-full bg-(--gray-light) hover:bg-(--primary-color) hover:text-white transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed'
                                                >
                                                    -
                                                </button>
                                                <span className='text-lg font-semibold text-(--black-color) min-w-8 text-center'>
                                                    {displayQuantity}
                                                </span>
                                                <button 
                                                    onClick={() => handleQuantityIncrease(item)}
                                                    className='w-8 h-8 rounded-full bg-(--gray-light) hover:bg-(--primary-color) hover:text-white transition-all duration-300 font-bold'
                                                >
                                                    +
                                                </button>
                                            </div>

                                            * Subtotal and Remove *
                                            <div className='md:col-span-2 flex flex-col items-center gap-2'>
                                                <p className='text-xl font-bold text-(--black-color)'>
                                                    ₹{(itemPrice * displayQuantity).toFixed(2)}
                                                </p>
                                                <button 
                                                    onClick={() => handleRemoveItem(item)}
                                                    className='text-sm text-red-600 hover:text-red-800 hover:underline transition-colors'
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                  * Promo Code Section *
                    <div className='bg-white rounded-xl shadow-lg p-4'>
                        <h3 className='text-lg font-Oswald text-(--black-color) mb-3 flex items-center gap-2'>
                            <span className='text-2xl'>🎟️</span>
                            Apply Promo Code
                        </h3>
                        <div className='flex gap-2'>
                            <input 
                                type="text" 
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder='Enter promo code'
                                className='flex-1 px-4 py-2 border-2 border-(--gray-light) rounded-lg focus:outline-none focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/20 transition-all'
                            />
                            <button 
                                onClick={handleApplyPromo}
                                className='px-6 py-2 bg-(--secondary-color) text-(--black-color) rounded-lg font-semibold hover:bg-(--secondary-color)/90 transition-all duration-300 hover:scale-105'
                            >
                                Apply
                            </button>
                        </div>
                        {discount > 0 && (
                            <p className='text-sm text-(--green-dark) mt-2 font-semibold'>
                                ✓ {discount}% discount applied!
                            </p>
                        )}
                        <div className='mt-3 pt-3 border-t border-(--gray-light)'>
                            <p className='text-xs text-(--gray-dark) mb-2'>Available codes:</p>
                            <div className='flex flex-wrap gap-2'>
                                <span className='text-xs bg-(--secondary-color)/20 px-2 py-1 rounded'>SAVE10 - 10% off</span>
                                <span className='text-xs bg-(--secondary-color)/20 px-2 py-1 rounded'>SAVE20 - 20% off</span>
                                <span className='text-xs bg-(--secondary-color)/20 px-2 py-1 rounded'>FIRST - 15% off</span>
                            </div>
                        </div>
                    </div>
                </div>

               * Order Summary Section *
                <div className='lg:col-span-1'>
                    <div className='bg-white rounded-xl shadow-lg p-6 sticky top-20'>
                        <h2 className='text-2xl font-Oswald text-(--black-color) mb-6 flex items-center gap-2'>
                            <span className='text-3xl'>📋</span>
                            Order Summary
                        </h2>

                        <div className='flex flex-col gap-3 mb-6'>
                            <div className='flex justify-between text-(--gray-dark)'>
                                <span>Subtotal</span>
                                <span className='font-semibold'>₹{subtotal.toFixed(2)}</span>
                            </div>
                            
                            {discount > 0 && (
                                <div className='flex justify-between text-(--green-dark)'>
                                    <span>Discount ({discount}%)</span>
                                    <span className='font-semibold'>-₹{discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className='flex justify-between text-(--gray-dark)'>
                                <span>Tax (8%)</span>
                                <span className='font-semibold'>₹{tax.toFixed(2)}</span>
                            </div>

                            <div className='flex justify-between text-(--gray-dark)'>
                                <span className='flex items-center gap-1'>
                                    Delivery Fee
                                    {deliveryFee === 0 && <span className='text-xs text-(--green-dark) font-semibold'>FREE</span>}
                                </span>
                                <span className='font-semibold'>
                                    {deliveryFee === 0 ? '₹0' : `₹${deliveryFee.toFixed(2)}`}
                                </span>
                            </div>

                            <div className='h-px bg-(--gray-light) my-2'></div>

                            <div className='flex justify-between text-xl font-bold text-(--black-color)'>
                                <span>Total</span>
                                <span className='text-(--primary-color)'>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {subtotal < 500 && (
                            <div className='bg-(--secondary-color)/20 border border-(--secondary-color) rounded-lg p-3 mb-4'>
                                <p className='text-sm text-(--black-color)'>
                                    💡 Add ₹{(500 - subtotal).toFixed(2)} more for free delivery!
                                </p>
                            </div>
                        )}

                        <button 
                            onClick={handleCheckout}
                            className='w-full py-3 bg-(--primary-color) text-white rounded-lg font-bold text-lg hover:bg-(--primary-color)/90 transition-all duration-300 hover:scale-105 shadow-md'
                        >
                            Proceed to Checkout
                        </button>

                        <Link to='/menu' className='block w-full text-center py-3 mt-3 border-2 border-(--primary-color) text-(--primary-color) rounded-lg font-semibold hover:bg-(--primary-color) hover:text-white transition-all duration-300'>
                            Continue Shopping
                        </Link>

                        <div className='mt-6 pt-6 border-t border-(--gray-light)'>
                            <p className='text-xs text-(--gray-dark) text-center mb-2'>We accept</p>
                            <div className='flex justify-center gap-3 flex-wrap'>
                                <div className='px-3 py-1 bg-(--gray-light) rounded text-xs font-semibold'>💳 Card</div>
                                <div className='px-3 py-1 bg-(--gray-light) rounded text-xs font-semibold'>📱 UPI</div>
                                <div className='px-3 py-1 bg-(--gray-light) rounded text-xs font-semibold'>💰 COD</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

    // Initialize quantities from dishes
    useEffect(() => {
        const quantities: Record<string, number> = {};
        dishes.forEach((dish: DishData) => {
            if (!quantities[dish.dish_id]) {
                quantities[dish.dish_id] = 1;
            }
        });
        setItemQuantities(quantities);
    }, [dishes]);

    // Get unique dishes with quantities
    const cartItems: CartItemWithQuantity[] = dishes.reduce((acc: CartItemWithQuantity[], dish: DishData) => {
        const existingItem = acc.find(item => item.dish_id === dish.dish_id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            acc.push({ ...dish, quantity: 1 });
        }
        return acc;
    }, []);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.discounted_price ? parseFloat(item.discounted_price) : parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = subtotal > 500 ? 0 : 40; // Free delivery over ₹500
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + tax + deliveryFee - discountAmount;

    const handleQuantityIncrease = async (dish: CartItemWithQuantity) => {
        if (!user_id) {
            toast.error('Please login to update cart');
            return;
        }

        try {
            await dispatch(addOrUpdateCart({
                dish_id: dish.dish_id,
                customer: user_id,
                quantity: '1'
            })).unwrap();
            
            setItemQuantities(prev => ({
                ...prev,
                [dish.dish_id]: (prev[dish.dish_id] || dish.quantity) + 1
            }));
            toast.success('Quantity updated');
        } catch (error) {
            toast.error('Failed to update quantity');
        }
    };

    const handleQuantityDecrease = async (dish: CartItemWithQuantity) => {
        if (!user_id) {
            toast.error('Please login to update cart');
            return;
        }

        const currentQty = itemQuantities[dish.dish_id] || dish.quantity;
        
        if (currentQty <= 1) {
            handleRemoveItem(dish);
            return;
        }

        try {
            await dispatch(addOrUpdateCart({
                dish_id: dish.dish_id,
                customer: user_id,
                quantity: '-1'
            })).unwrap();
            
            setItemQuantities(prev => ({
                ...prev,
                [dish.dish_id]: currentQty - 1
            }));
            toast.success('Quantity updated');
        } catch (error) {
            toast.error('Failed to update quantity');
        }
    };

    const handleRemoveItem = (dish: DishData) => {
        dispatch(removeFromCart(dish));
        toast.success('Item removed from cart');
        
        setItemQuantities(prev => {
            const newQuantities = { ...prev };
            delete newQuantities[dish.dish_id];
            return newQuantities;
        });
    };

    const handleApplyPromo = () => {
        const promoCodes: Record<string, number> = {
            'SAVE10': 10,
            'SAVE20': 20,
            'FIRST': 15
        };

        if (promoCodes[promoCode.toUpperCase()]) {
            setDiscount(promoCodes[promoCode.toUpperCase()]);
            toast.success(`Promo code applied! ${promoCodes[promoCode.toUpperCase()]}% off`);
        } else {
            toast.error('Invalid promo code');
        }
    };

    const handleCheckout = () => {
        if (!user_id) {
            toast.error('Please login to checkout');
            return;
        }
        if (dishesInCartCount === 0) {
            toast.error('Your cart is empty');
            return;
        }
        toast.success('Proceeding to checkout...');
    };
*/