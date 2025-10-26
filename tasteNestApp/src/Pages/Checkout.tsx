import React, { useEffect, useState } from 'react'
import { AddressForm, Container } from '../components'
import { useForm,FormProvider, type Message } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link,useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../redux/store/store';
import axios,{AxiosError} from 'axios';
import { emptyCart } from '../redux/features/Cart/cartSlice';


const CheckoutSchema = z.object({
    address: z.object({
      street: z.string().min(10, "Address required"),
    note : z.string(),
  city: z.string().min(2, "City required"),
  pincode: z.string().length(6, "6-digit pincode required"),}),
  paymentMethod : z.string().min(3, "Select payment method"),
})

export type CheckoutFormData = z.infer<typeof CheckoutSchema>

const availablePromoCodes: Record<string,string> = {
            "SAVE10" : "10",
            "SAVE20" : "20",
            "FIRST15" : "15"
        }

const Checkout = () => {

  const [currentStep,setCurrentStep] = useState(1);
  const methods = useForm<CheckoutFormData>({
          resolver : zodResolver(CheckoutSchema),
          defaultValues : {
              address : {
                street: '',
                note : '',
                city : '',
                pincode : ''
              },
              paymentMethod: ''
          }
      });

      const {dishes, dishesInCartCount} = useSelector((state: RootState)=> state.cart)
      const {user_id} = useSelector((state:RootState)=> state.logIn)
      const [searchParams] =useSearchParams();
      const discountCode = searchParams.get('d');
      const navigate = useNavigate();
      const dispatch = useDispatch<AppDispatch>();

      useEffect(()=>{
        if(!user_id){
          toast.error("Login to place an order!");
          navigate('/login');
        }
        else if(dishesInCartCount === 0){
          toast.error("Add items to cart to place an order!");
          navigate('/menu');
        }
      },[])

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
      const setValue = methods.setValue;
      const watch = methods.watch;
      const selectedPaymentMethod = watch("paymentMethod");

      

      const handleNext = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await methods.trigger(['address.street', 'address.city', 'address.pincode', "address.note"]);
    } else if (currentStep === 2) {
      isValid = await methods.trigger(["paymentMethod"]);
    }
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };


let totalCartValue = 0;
dishes.forEach((dish)=>{
  totalCartValue  = totalCartValue + ((dish.discounted_price ? Number(dish.discounted_price) : Number(dish.price))*Number(dish.quantity))
})

let discount = '';
if(discountCode){
  discount = availablePromoCodes[discountCode];
}

const handleCheckoutFormSubmit = async() => {
  try{
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/orders/place-order/`,{
    customer:user_id,
    payment_method:methods.getValues("paymentMethod"),
    address: [methods.getValues("address.street"),methods.getValues("address.city"),methods.getValues("address.pincode")].join(', '),
    total_amount: ((totalCartValue * 0.08) + Number(totalCartValue.toFixed(2)) - (Number(totalCartValue) * (Number(discount)/100))).toFixed(2)
  }, {
    headers:{
      "Content-Type": "application/json"
    }
  })
  if(response.status === 201){
    toast.success(response.data.message || "Order placed successfully!")
    dispatch(emptyCart());
    navigate('/');
  }
}
catch(err){
  const error = err as AxiosError;
  if(error.response && error.response.data){
    toast.error((error.response.data as Message) || "Something went wrong!")
  }
}
}

  return (
    <div className='min-h-[80vh] pt-18 bg-(--gray-light)/30'>
      <Container>
        <div className='flex flex-col gap-8 pb-8'>
         <h1 className='text-center text-6xl text-(--primary-color) relative max-sm:text-4xl font-Oswald' data-aos="fade-down">
            Chec<span className='before:content-[""] before:w-26 max-sm:before:w-17 before:h-1 before:absolute before:-bottom-1 before:bg-(--secondary-color) before:rounded-lg'>kout</span>
         </h1>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4' >

              <div className='col-span-1 lg:col-span-3 bg-white shadow-2xl rounded-lg p-4'>
                <div   className='w-full flex justify-center items-center' data-aos="fade-right">
                {
                  [1,2,3].map((step)=>

                    <React.Fragment key={step}>
                      
                    <div className='flex flex-col justify-center text-center'>
                    <div className={`w-14 h-14 max-sm:w-10 max-sm:h-10 rounded-full text-white font-semibold flex justify-center items-center text-lg transition-all duration-700
                      ${
                        currentStep === step ? 'bg-(--primary-color) ring-4 ring-(--primary-color)/60' : 
                        currentStep > step ? 'bg-(--green-dark)/80 ring-4 ring-(--green-dark)/60' : 'bg-(--gray-dark)/80'
                      }
                      
                      `}>
                        { currentStep > step ? '✓' : step}
                    </div>
                    <p className='text-center max-sm:text-sm px-1 py-1'>

                    {
                      (step === 1 && 'Delivery') ||
                      (step === 2 && 'Payment') ||
                      (step === 3 && 'Review')
                    }
                    </p>
                    </div>
                    {
                      step !== 3 && <div className={`flex-1 h-1 rounded-lg transition-all duration-700 -mt-3 mx-2 max-sm:mx-0 max-sm:mr-2 max-sm:-ml-1 ${
                        currentStep > step ? 'bg-(--green-dark)/80' : 'bg-(--gray-dark)/80'
                      }`}/> 
                    }
                    </React.Fragment>
                  )
                }
                </div>
              </div>
                <div className='bg-white shadow-2xl rounded-xl p-4 col-span-1 lg:col-span-2' >
                <FormProvider {...methods} >
                  <form noValidate onSubmit={methods.handleSubmit(handleCheckoutFormSubmit)} data-aos="fade-up">
                  {
                    currentStep === 1 ?  <>
                     <div className='flex items-center gap-3 mb-6'>
                      <div className='w-12 h-12 rounded-full bg-(--primary-color)/10 flex items-center justify-center'>
                        <span className='text-2xl'>📍</span>
                      </div>
                      <div>
                        <h2 className='text-2xl font-Oswald font-bold text-(--black-color)'>Delivery Address</h2>
                        <p className='text-sm text-(--gray-dark)'>Where should we deliver?</p>
                      </div>
                    </div>
                    <AddressForm/>
                    </> : currentStep === 2 ? <div className='flex flex-col items-center gap-5 mb-6' data-aos="fade-up">
                      {
                        paymentMethods.map((method)=>
                        <button key={method.id} 
                        onClick={()=> {
                          setValue("paymentMethod",method.id,{shouldValidate:true});
                        }}
                        type='button' className={` shadow-xl px-5 py-3 rounded-xl w-full border-2  transition-all duration-500 ${
                          selectedPaymentMethod === method.id ? 'bg-(--primary-color)/10  border-(--primary-color)/70 hover:border-(--secondary-color)' : 'bg-(--gray-dark)/10 border-(--gray-light) hover:border-(--gray-dark)'
                        }`
                        
                        }>
                          <div className='flex flex-col items-center justify-center text-white gap-4'>
                            <p className='text-6xl drop-shadow-2xl max-sm:text-4xl'>{method.icon}</p>
                            <div className='w-full text-center text-(--black-color)/80'>
                            <p className='text-3xl max-sm:text-xl font-semibold font-Oswald'>{method.name}</p>
                            <p className='text-3xl max-sm:text-xl font-light'>{method.description}</p>
                            </div>
                          </div>
                        </button>
                      )}
                      </div> : <div className='flex flex-col gap-2' data-aos="fade-up">
                        <div className='flex flex-col justify-center items-center'>
                          <span className='text-3xl flex justify-center items-center'>✅ <p className='font-Oswald tracking-wide'>Review Your Order</p></span>
                          <p className='text-xl text-center ml-9.5 font-light'>Everything looks good?</p>
                        </div>
                        <div className='flex flex-col gap-3'>

                          <div className='border-2 border-(--gray-light) rounded-xl p-4 flex flex-col gap-2'>
                        <h3 className='font-bold text-(--black-color) mb-2 flex items-center gap-2 text-xl'>
                          <span className='-mt-1.5'>🛍️</span> Order Items ({dishesInCartCount})
                        </h3>
                        {
                          dishes.map((item)=>  { const price = item.discounted_price ? parseFloat(item.discounted_price) : parseFloat(item.price);
                            return (
                              <div key={item.dish_id} className='flex justify-between items-center py-2 border-b border-(--gray-light) last:border-0'>
                                <div className='flex items-center gap-2'>
                                  <span className='font-medium text-sm capitalize'>🍽️ {item.name}</span>
                                  <span className='text-xs text-(--gray-dark)'>x{item.quantity}</span>
                                </div>
                                <span className='font-bold text-(--primary-color)'>₹{(price * Number(item.quantity)).toFixed(2)}</span>
                              </div>)
})
                        }
                      </div>

                           <div className='border-2 border-(--gray-light) rounded-xl p-4'>
                        <h3 className='font-bold text-(--black-color) mb-2 flex items-center gap-2 text-xl'>
                          <span>📍</span> Delivery Address
                        </h3>
                        <p className='text-xl text-(--gray-dark) capitalize'>{[methods.getValues("address.street"),methods.getValues("address.city"),methods.getValues("address.pincode")].join(', ')}</p>
                        {methods.getValues("address.note") && <p className='text-lg'><span className='font-medium'>Delivery Note:</span> {methods.getValues("address.note")}</p>}
                      </div>

                          <div className='border-2 border-(--gray-light) rounded-xl p-4'>
                        <h3 className='font-bold text-(--black-color) mb-2 flex items-center gap-2 text-xl'>
                          <span className='-mt-1.5'>💳</span> Payment Method
                        </h3>
                        <p className='text-xl text-(--gray-dark)'>{(paymentMethods.filter((method)=> method.id === methods.getValues("paymentMethod")))[0].icon} {(paymentMethods.filter((method)=> method.id === methods.getValues("paymentMethod")))[0].name}</p>
                      </div>

                        </div>
                       </div>
                  }
                  <div className='w-full flex justify-between gap-10 font-semibold text-xl pt-3' data-aos="zoom-in" data-aos-offset="-50">
                  {
                    currentStep === 1 ? <Link to={"/cart"} className='w-full'>
                      <button type='button' className='px-3 py-2 rounded-lg bg-(--gray-dark)/70 w-full cursor-pointer hover:scale-105 transition-all duration-500' >
                      Back
                    </button>
                    </Link> : <button type='button' className='px-3 py-2 rounded-lg bg-(--gray-dark)/70 w-full cursor-pointer hover:scale-105 transition-all duration-500' onClick={()=> setCurrentStep((prev) => Math.max(prev-1,1))} >
                      Back
                    </button>
                  }
                  
                  {
                    currentStep <= 2 && <button type='button' className='text-white px-3 py-2 rounded-lg bg-(--primary-color) w-full cursor-pointer hover:scale-105 transition-all duration-500' onClick={handleNext} >
                      Next
                    </button>} {currentStep === 3 && <button type='submit' className='text-white px-3 py-2 rounded-lg bg-(--primary-color) w-full cursor-pointer hover:scale-105 transition-all duration-500' >
                      Place Order
                    </button> 
                  }
                  </div>
                </form>
                </FormProvider>
                </div>
                <div className='col-span-1 bg-white shadow-2xl p-4 rounded-xl flex flex-col gap-2' data-aos="fade-left">
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
                    </div>
                </div>
          </div>
         </div>
      </Container>
    </div>
  )
}

export default Checkout