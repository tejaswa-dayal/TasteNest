    import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
    import axios,{  AxiosError } from "axios";
    import type { PayloadAction } from '@reduxjs/toolkit'
    import {toast} from "react-hot-toast";
    import { logout } from "../../actions/globalAction";

    export type addOrUpdateCartPayload = {
        dish_id : string;
        customer : string;
        quantity? : string;
    }

    export type removeDishFromCartType = {
        dish : string;
        customer : string;
    }

    type cartSliceState = {
        dishes : InCartDishData[];
        dishesInCartCount : number;
        addOrUpdateCartError : string | null;
        removeDishFromCartError : string | null;
    }

    const initialState : cartSliceState = {
        dishes : [],
        dishesInCartCount : 0,
        addOrUpdateCartError : null,
        removeDishFromCartError : null,
    }
    
    export interface DishData  {
        dish_id : string
        name : string
        price : string
        discounted_price : string
        featured : string
        dish_image : string
        category : string
    }

    export interface InCartDishData extends DishData {
        quantity : string;
    }

    type UpdateQuantityPayload = {
        dish_id : string;
        newQuantity : number;
    }

    export const addOrUpdateCart = createAsyncThunk("cart/addOrUpdateCart",async(payload : addOrUpdateCartPayload,{rejectWithValue})=>{
        try{
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/cart/add-to-or-update-cart/`,payload, {
                headers:{
                    "Content-Type" : "application/json",
                }
            })
        return response?.data
        }
        catch(err) {
            const error = err as AxiosError;
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data || "Something went wrong!")
            }
            return rejectWithValue("Unexpected error.")
        }
    })

        export const removeDishFromCart = createAsyncThunk("cart/removeDishFromCart",async(payload : removeDishFromCartType,{rejectWithValue})=>{
        try{
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/cart/remove-dish-from-cart/`,{data :payload})
        return response?.data
        }
        catch(err) {
            const error = err as AxiosError;
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data || "Something went wrong!")
            }
            return rejectWithValue("Unexpected error.")
        }
    })

    export const getDishesInCart = createAsyncThunk("cart/getDishesInCart",async(payload:string, {rejectWithValue})=>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/cart/get-cart-items/?user=${payload}`)
            return response?.data
        }
        catch(err){
            const error = err as AxiosError;
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data || "Something went wrong!");
            }
            return rejectWithValue("Unexpected error.");
        }
    })

    const CartSlice = createSlice({
        name : "cart",
        initialState : initialState,
        reducers : {
            addDishToCart(state,action : PayloadAction<DishData>){
                state.dishes.push({...action.payload, "quantity" : "1"});
                state.dishesInCartCount = state.dishes.length;
                toast.success(`${action?.payload.name} added to cart successfully.`)
            },
            removeFromCart(state,action : PayloadAction<DishData>){
                state.dishes = state.dishes.filter((dishData)=> dishData.dish_id !== action.payload.dish_id)
                state.dishesInCartCount = state.dishes.length;
                toast.error(`${action?.payload.name} removed from cart successfully.`)
            },
            updateQuantityOfDishInCart(state,action: PayloadAction<UpdateQuantityPayload>){
                const {dish_id,newQuantity} = action.payload;
                const dish = state.dishes.find(d => d.dish_id === dish_id);
  if (dish) {
    dish.quantity = String(newQuantity);
  }             
            },
            emptyCart(state){
                state.dishes = [];
                state.dishesInCartCount = 0;
                state.addOrUpdateCartError = null;
                state.removeDishFromCartError = null;
            }
        },
        extraReducers : (builder) =>{
            builder.addCase(addOrUpdateCart.pending,(state)=>{
                state.addOrUpdateCartError = null;
            });
            builder.addCase(addOrUpdateCart.rejected,(state,action)=>{
                state.addOrUpdateCartError = action.payload as string;
                toast.error(state.addOrUpdateCartError);
            });
            builder.addCase(removeDishFromCart.pending,(state)=>{
                state.removeDishFromCartError = null;
            });
            builder.addCase(removeDishFromCart.rejected,(state,action)=>{
                state.removeDishFromCartError = action?.payload as string;
                toast.error(state.removeDishFromCartError);
            });
            builder.addCase(logout,()=>{
                        return initialState
                    });
                    builder.addCase(getDishesInCart.fulfilled,(state,action)=>{
                        
                        if(action.payload && Array.isArray(action.payload)){
                            state.dishes = action.payload;
                            state.dishesInCartCount = action.payload.length;
                        }
                    })
        }
    })

    export const {addDishToCart, removeFromCart, updateQuantityOfDishInCart, emptyCart} = CartSlice.actions
    export default CartSlice.reducer