import  {   useEffect, useState, type ReactElement } from 'react'
import CartIcon from '../../assets/Navbar/cartIcon.svg?react'
import CrossedCartIcon from '../../assets/Navbar/crossedCart.svg?react'
import { useDispatch, useSelector } from 'react-redux';
import  { type AppDispatch, type RootState } from '../../redux/store/store';
import  {addDishToCart, removeFromCart , addOrUpdateCart, type DishData, removeDishFromCart } from '../../redux/features/Cart/cartSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {motion} from 'motion/react'


type DishCardProps = {
    bigCard? : boolean;
    className? : string;
    dish : DishData; 
}


const DishCard = ({bigCard=false,className,dish}:DishCardProps):ReactElement => {
    const [addToCart, setAddToCart] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {user_id} = useSelector((state : RootState) => state.logIn)
    const {dishes} = useSelector((state : RootState) => state.cart)

    useEffect(()=>{
        const exists = dishes.some(item => item.dish_id === dish.dish_id);
    if (exists){
        setAddToCart(false);
    }
    },[])
    

    const handleAddRemoveDishFromCart = (dish : DishData)=>{
        if (user_id){
        if (addToCart){
            
            dispatch(addDishToCart(dish));
            dispatch(addOrUpdateCart({"dish_id" :dish.dish_id,"customer":user_id}));
        }
        else{
            dispatch(removeFromCart(dish));
            dispatch(removeDishFromCart({"dish":dish.dish_id,"customer": user_id}));
        }
    }
    else {
        toast.error("Login to place an order.");
        navigate("/login");
    }
    }
  return (
    <motion.div className={`border-3 bg-(--secondary-color)/50 border-(--secondary-color) rounded-lg relative flex flex-col ${!bigCard ? "shadow-2xl py-2 px-3.5" : "py-6 px-8"}  justify-between items-center transition-transform duration-700  mt-3 mb-3 ml-3 mr-3 min-h-72 group hover:scale-105 ${className}`} 
    initial={{ y:20,opacity:0,}}
    whileInView={{y:0,opacity:1 }}
    transition={{duration:0.3,ease:'easeIn'}}
    >
        {dish.discounted_price && <div className={`absolute bg-(--primary-color)/79 -top-0.5 left-3 ${bigCard ? "w-11.5 h-12" : "w-10 h-10"} flex justify-center items-center [clip-path:polygon(0_0,100%_0,100%_68%,50%_100%,0_68%)] shadow-3xl`}>
            <h6 className={`text-white font-semibold uppercase ${bigCard ? "" : "text-sm"}`}>Sale</h6>
        </div> }
        <div className='flex items-center justify-center overflow-hidden overflow-y-hidden relative before:content-[""] before:w-full before:-z-10 before:h-0 before:bg-(--primary-color) before:absolute before:bottom-[50%] before:translate-y-[50%] before:rounded-l-full before:rounded-r-full group-hover:before:h-[80%] before:transition-all before:duration-700 grow'>
            <img src={dish.dish_image} alt="" className={`object-contain ${!bigCard ? "w-50 h-50" : "w-60 h-60"}`}/>
        </div>
        <div className='flex justify-between self-start'>
            <div className='flex flex-col gap-2'>
                <h1 className={`${bigCard ? "text-3xl" : "text-xl"} font-semibold text-(--black-color)`}>{dish.name}</h1>
                <div className='flex gap-2 w-full'>

                <p className={`text-(--gray-dark) ${dish.discounted_price ? "font-medium line-through decoration-(--black-color)" : "font-semibold"} ${bigCard ? "text-2xl" : "text-lg"}`}><span className={`${dish.discounted_price || "text-(--primary-color)"}`}>₹{dish.price}</span></p>
                {dish.discounted_price && <p className={`text-(--gray-dark) font-semibold ${bigCard ? "text-2xl" : "text-xl"}`}><span className='text-(--primary-color)'>₹{dish.discounted_price}</span></p>}
                
                </div>
            </div>
                   
                    <div className={`bg-(--secondary-color) justify-self-end flex items-center justify-center absolute p-2 rounded-full ${bigCard ? "bottom-6 right-2" : "bottom-2 right-2"} group/cart ${(addToCart && "hover:bg-(--primary-color)") || "hover:bg-(--gray-dark)"} cursor-pointer transition-colors duration-400`}>
                        {addToCart ? (<CartIcon className={`${bigCard ? "w-10 h-10" : "w-7 h-7"}  group-hover/cart:text-white`} onClick={()=> {setAddToCart(!addToCart);
                        handleAddRemoveDishFromCart(dish);
                        }}/>) : ((<CrossedCartIcon className={`${bigCard ? "w-10 h-10" : "w-7 h-7"}  group-hover/cart:text-white`} onClick={()=> {setAddToCart(!addToCart);
                            handleAddRemoveDishFromCart(dish);
                        }}/>))}
                    </div>
        </div>
    </motion.div>
  )
}


export default DishCard
