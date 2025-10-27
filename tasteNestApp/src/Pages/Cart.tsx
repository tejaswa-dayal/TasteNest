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
                        <div className='sm:flex gap-2 max-sm:grid max-sm:grid-cols-1'>
                            <input type="text"
                            value={promoCode}
                            placeholder='Enter Promo Code'
                            onChange={(e)=>setPromoCode(e.target.value)}
                            className='flex-1 px-4 py-2 border-2 border-(--gray-light) rounded-lg focus:outline-none focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/20 transition-all max-sm:col-span-1'/>
                            <button className='bg-(--green-dark)/80 text-white tracking-wider font-semibold rounded-lg px-4 py-1 hover:bg-(--green-dark) transition-all duration-500 cursor-pointer max-sm:col-span-1'
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



