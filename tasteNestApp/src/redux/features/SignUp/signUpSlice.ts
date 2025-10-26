import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

type FormValues = {
    name : string;
    email : string;
    password : string;
}

type signUpState = {
    successMessage : boolean,
    error : string | null,
    loading : boolean,
    
}

const initialState : signUpState = {
    successMessage : false,
    error : null,
    loading : false,
}

export const signUpUser = createAsyncThunk("users/signUp", async(payload:FormValues, {rejectWithValue}) => {
    try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/sign-up/`,payload, {
  headers: {
    "Content-Type": "application/json",
  },});
    toast.success("Sign Up Successful!");
    return response?.data
        }
    catch(err) {
        const error = err as AxiosError;
        if(error.response && error.response.data){
            return rejectWithValue(error.response.data || "Something went wrong!");
        
        }
        return rejectWithValue("Unexpected error.");
    }
})

const SignUpSlice = createSlice({
    name : "signUp",
    initialState : initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(signUpUser.pending, (state) => {
            state.loading = true;
            state.successMessage = false;
            state.error = null;
        });
        builder.addCase(signUpUser.fulfilled, (state) => {
            state.loading = false;
            state.successMessage = true;
            state.error = null;
        });
        builder.addCase(signUpUser.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.successMessage = false;
            toast.error("Sign-up failed!")
        })
    }
})

export default SignUpSlice.reducer;