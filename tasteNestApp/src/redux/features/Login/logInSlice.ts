import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { logout } from "../../actions/globalAction";
import { getDishesInCart } from "../Cart/cartSlice";

type LoginFormData = {
    email : string;
    password : string;
}

type LoginState = {
    error : string | null;
    loading : boolean;
    status : boolean;
    name : string | null;
    user_id : string | null;
}

const initialState : LoginState ={
    error : null,
    loading : false,
    status: false,
    name : null,
    user_id : null,
}

export const logInUser = createAsyncThunk("users/login", async(payload: LoginFormData, {dispatch,rejectWithValue}) => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/login/`,payload, {
            headers:{
                "Content-Type" : "application/json",
            }
        })
        dispatch(getDishesInCart(response.data.user_id as string));
        return response?.data
    }
    catch(err) {
        const error = err as AxiosError
        if(error.response && error.response.data){
            return rejectWithValue(error.response.data || "Something went wrong!")
        }
        return rejectWithValue("Unexpected error.")
    }
})

const LogInSlice = createSlice({
    name : "logIn",
    initialState:initialState,
    reducers : {
        logout(state){
            state.loading = false;
            state.error = null;
            state.status = false;
            state.name = null;
            state.user_id = null;
            toast.success("Logged out successfully!")
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(logInUser.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.status = false;
            state.name = null;
            state.user_id = null;
        });
        builder.addCase(logInUser.fulfilled,(state,action) =>{
            state.loading = false;
            state.error = null;
            state.status = true;
            state.name = action.payload?.name;
            state.user_id = action.payload?.user_id;
            
            toast.success(`Welcome, ${action.payload?.name}`);
        });
        builder.addCase(logInUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string;
            state.status = false;
            state.name = null;
            state.user_id = null;
            toast.error("Login failed");
        });
        builder.addCase(logout,()=>{
            return initialState
        });
    }
});

export default LogInSlice.reducer;
