import { useEffect, useState } from 'react'
import {Container} from '../components'
import { useSelector} from 'react-redux'
import { type RootState } from '../redux/store/store'
import { Link } from 'react-router-dom'
import axios,{AxiosError} from 'axios'
import type { Message } from 'react-hook-form'
import toast from 'react-hot-toast'
import { type InCartDishData } from '../redux/features/Cart/cartSlice'
import {motion,AnimatePresence} from "motion/react";

interface OrderData {
  order_id : string;
  ordered_on : string;
  total_amount : string;
  payment_method : string;
  address : string;
  customer : string;
  dishes : InCartDishData[];
}

const Order = () => {
  const {user_id} = useSelector((state:RootState)=>state.logIn)
  const [orders,setOrders] = useState<OrderData[] | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const getOrders = async()=>{
    try{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/orders/get-orders/?user=${user_id}`,{
      headers:{
        'Content-Type':'application/json'
      }
    })
    setOrders(response.data);
  }
    catch(err){
      
  const error = err as AxiosError;
  if(error.response && error.response.data){
    toast.error((error.response.data as Message) || "Something went wrong!")
  }
}
  }
  useEffect(()=>{
    if(user_id){
      getOrders();
    }
  },[])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    if (formattedDate.includes('am')){
    return formattedDate.replace('am','AM')}
    else{
      return formattedDate.replace('pm','PM')
    }
    
  };

  const setOrderExpansion = (order_id: string | null) => {
    setExpandedOrder(expandedOrder === order_id?null:order_id);
  }

  const paymentMethods = [
    {
      id: "card",
      icon : "💳",
      name : "Credit / Debit Card",
      description : "Visa, Mastercard, Rupay",
    },
    {
      id : "upi",
      icon : "📱",
      name: "UPI Payment",
      description : "Google Pay, PhonePe, Paytm, BHIM",
    },
    {
    id: "cod",
    icon : "💰",
    name : "Cash On Delivery",
    description : "Pay when your order arrives",
  },
]

const getPaymentMethodDetails = (paymentMethod:string)=>{
  const method =  (paymentMethods.filter((method)=> method.id === paymentMethod))[0]
  return method;
}
const totalPages = orders ? Math.ceil(orders.length / 5) : 1;
const indexOfLastItemOnPage = currentPage*5;
const indexOfFirstItemOnPage = indexOfLastItemOnPage - 5;
  return (
    <div className='min-h-[80vh] pt-18 bg-(--gray-light)/30'>
      <Container>
        <div className='flex flex-col gap-8 pb-8'>
         <h1 className='text-center text-6xl text-(--primary-color) relative max-sm:text-4xl font-Oswald' data-aos="fade-down">
            Ord<span className='before:content-[""] before:w-18 max-sm:before:w-11 before:h-1 before:absolute before:-bottom-1 before:bg-(--secondary-color) before:rounded-lg'>ers</span>
         </h1>

         {!user_id ? (
            <div className='flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-lg'>
                <div className='text-8xl mb-4' data-aos="fade-right">🔒</div>
                <h2 className='text-2xl text-(--gray-dark) font-Oswald mb-2 text-center' data-aos="fade-left">Login to view your previous orders</h2>
                <Link to='/login' className='mt-4 px-6 py-3 bg-(--primary-color) text-white rounded-lg font-semibold hover:bg-(--primary-color)/90 transition-all duration-300 hover:scale-105' data-aos="fade-up">
                    Login Now
                </Link>

            </div>
         ) : Array.isArray(orders) && orders.length > 0 ? 
        (<>
         <div className='flex flex-col items-center w-full gap-4'  data-aos="fade-up">
            {
              orders.slice(indexOfFirstItemOnPage,indexOfLastItemOnPage).map((order:OrderData)=>(
                <div key={order.order_id} className='w-full'>
                 <div 
                          className='p-6 cursor-pointer hover:bg-(--gray-light)/10 transition-colors bg-white w-full shadow-2xl'
                          key={order.order_id}
                          onClick={()=> setOrderExpansion(order.order_id)}
                        >
                          <div className='flex items-center justify-between flex-wrap gap-4 max-lg:gap-2'>
                            <div className='flex items-center gap-4'>
                              <div className='w-12 h-12 rounded-full bg-(--primary-color)/10 flex items-center justify-center text-2xl' >
                                📦
                              </div>
                              <div>
                                <h3 className='font-bold text-lg max-lg:text-sm max-sm:text-xs text-(--black-color)'>
                                  Order #{order.order_id}
                                </h3>
                                <p className='text-sm text-(--gray-dark)'>
                                  {formatDate(order.ordered_on)}
                                </p>
                              </div>
                            </div>

                            <div className='flex items-center gap-4 max-sm:w-full max-sm:justify-between'>
                              <div className='text-right'>
                                <p className='text-sm max-sm:text-xs text-(--gray-dark)'>Total Amount</p>
                                <p className='text-2xl max-lg:text-lg max-sm:text-sm max-sm:text-center font-bold text-(--primary-color)'>₹{order.total_amount}</p>
                              </div>
                              <div className='flex items-center gap-2'>
                                <span className='px-3 py-1 bg-(--secondary-color)/20 text-(--black-color) rounded-full text-xs font-semibold'>
                                  {order.dishes.length} {order.dishes.length === 1 ? 'item' : 'items'}
                                </span>
                                <button className={`text-2xl transition-transform duration-300 ${expandedOrder === order.order_id ? 'rotate-180' : 'rotate-0'}`} >
                                  ▼
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <AnimatePresence>
                        {expandedOrder === order.order_id && <motion.div className='w-full flex flex-col bg-(--gray-light) border-t p-6' animate={{opacity:[0,1], height:['0','auto']}}
                          transition={{duration:0.3,ease:'easeInOut'}}
                          exit={{opacity:0,height:0}}
                          >
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                              <div className='flex flex-col gap-3'>
                                <h3 className='flex gap-2 items-center text-(--black-color) font-semibold text-lg'>
                                  <span>🛍️</span> Order Items
                                </h3>
                                {
                                  order.dishes.map((dish:InCartDishData)=>(
                                    <div key={dish.dish_id} className='flex items-center max-sm:flex-col bg-white p-4 rounded-lg shadow-md gap-4 max-sm:text-center'>
                                      <img src={dish.dish_image} alt="" className='rounded-md w-25 object-contain'/>
                                      <div className='flex flex-col gap-2 flex-1'>
                                        <h4 className='font-semibold text-(--black-color)'>
                                          {dish.name}
                                        </h4>
                                        <p className='text-sm text-(--gray-dark)/60'>Qty: {dish.quantity}</p>
                                      </div>
                                      <div>
                                        <p className='text-(--primary-color) font-semibold text-lg max-sm:text-sm'>
                                         ₹{dish.discounted_price? (parseFloat(dish.discounted_price)*Number(dish.quantity)).toFixed(2) : (parseFloat(dish.price)*Number(dish.quantity)).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                              <div className='space-y-4'>
                                <div className='flex flex-col gap-3'>
                                  <h3 className='flex gap-2 items-center text-(--black-color) font-semibold text-lg'>
                                  <span className='-mt-1'>💳</span> Payment Method
                                </h3>
                                <div className='bg-white p-4 rounded-lg shadow-md'>
                                  <p className='flex items-center text-lg max-sm:text-sm'><span>{getPaymentMethodDetails(order.payment_method).icon}</span> {getPaymentMethodDetails(order.payment_method).name}</p>
                                </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                   <h3 className='flex gap-1 items-center text-(--black-color) font-semibold text-lg'>
                                  <span className=''>📍</span> Delivery Address
                                </h3>
                                <div className='bg-white p-4 rounded-lg shadow-md'>
                                  <p className='flex items-center text-lg flex-wrap max-sm:text-sm'>{order.address}</p>
                                </div>
                                </div>
                              </div>
                            </div>
                            </motion.div>}
                            </AnimatePresence>
                        </div>
              ))
            }
          </div>
          <div className='flex justify-center items-center gap-3 text-lg max-sm:text-sm' data-aos="fade-up">
            <button className={`${currentPage === 1 ? 'bg-(--gray-dark)/40 cursor-not-allowed text-(--black-color)' : 'bg-(--primary-color) cursor-pointer hover:scale-105 text-white'} transition-all duration-500  px-4 max-sm:px-2 py-1.5 rounded-lg  font-semibold flex justify-center items-center`} disabled={currentPage === 1} onClick={()=> setCurrentPage((prev)=> Math.max(prev-1,1))}>
            ← Previous
            </button>
            <span className='bg-(--secondary-color) rounded-lg px-4 max-sm:px-2 py-2 text-(--black-color) font-semibold flex items-center justify-center '>
            Page {currentPage} of {totalPages}
            </span>
            <button className={`${currentPage === totalPages ? 'bg-(--gray-dark)/40 cursor-not-allowed text-(--black-color)' : 'bg-(--primary-color) cursor-pointer hover:scale-105 text-white'} transition-all duration-500  px-4 max-sm:px-2 py-1.5 rounded-lg  font-semibold flex justify-center items-center`} disabled={currentPage === totalPages} onClick={()=> setCurrentPage((prev)=>Math.min(prev+1,totalPages))}>
            Next →
            </button>
          </div>
          </>
        ) : (<div className='flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-lg'>
                <div className='text-8xl mb-4' data-aos="fade-right">📦</div>
                <h2 className='text-2xl text-(--gray-dark) font-Oswald mb-2 max-sm:text-xl' data-aos="fade-left">You've not placed any orders yet.</h2>
                <p className='text-(--gray-dark) mb-6 max-sm:text-sm' data-aos="zoom-in">Add some delicious items to get started!</p>
                <Link to='/menu' className='px-6 py-3 bg-(--primary-color) text-white rounded-lg font-semibold hover:bg-(--primary-color)/90 transition-all duration-300 hover:scale-105' data-aos="fade-up">
                    Browse Menu
                </Link>
            </div>)}
          
         </div>
      </Container>
    </div>
  )
}

export default Order
