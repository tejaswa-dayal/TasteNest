import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios,{  AxiosError } from "axios";

type getFeaturedDishes = {
    featured : boolean;
}

export type DishData = {
        dish_id : string
        name : string
        price : string
        discounted_price : string
        featured : string
        dish_image : string
        category : string
    }[]

export type DishesResponseData = {
    [key : string] : DishData
}

type dishesSliceState = {
    dishes : DishesResponseData | null;
    error : string | null;
    featuredDishes : DishData | null;
}

const initialState : dishesSliceState = {
    dishes : null,
    error : null,
    featuredDishes : null,
}

export const  getFeaturedDishes = createAsyncThunk("dishes/featured-dishes",async(payload : getFeaturedDishes, {rejectWithValue})=>{
    
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/dishes/get-dishes/?featured=${payload}`, {
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


export const  getAllDishes = createAsyncThunk("dishes/all-dishes",async(_,{rejectWithValue})=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/dishes/get-dishes/`, {
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

const DishesSlice = createSlice({
    name: 'dishes',
    initialState : initialState,
    reducers : {},
    extraReducers: (builder) =>{
        builder.addCase(getAllDishes.pending,(state)=>{
            state.dishes = null;
            state.error = null;
            state.featuredDishes = null;
        })
        builder.addCase(getAllDishes.fulfilled, (state,action)=>{
            state.dishes = action.payload;
            state.error = null;
            state.featuredDishes = null;
        })
        builder.addCase(getAllDishes.rejected, (state,action)=>{
            state.dishes = null;
            state.error = action.payload as string;
            state.featuredDishes = null;
        })
        builder.addCase(getFeaturedDishes.pending,(state)=>{
            state.dishes = null;
            state.error = null;
            state.featuredDishes = null;
        })
        builder.addCase(getFeaturedDishes.fulfilled, (state,action)=>{
            state.dishes = null;
            state.error = null;
            state.featuredDishes = action.payload;
        })
        builder.addCase(getFeaturedDishes.rejected, (state,action)=>{
            state.dishes = null;
            state.error = action.payload as string;
            state.featuredDishes = null;
        })
    },
})

export default DishesSlice.reducer;