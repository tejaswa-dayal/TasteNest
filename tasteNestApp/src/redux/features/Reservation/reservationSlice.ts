import toast from "react-hot-toast";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios,{  AxiosError } from "axios";
import { logout } from "../../actions/globalAction";

type createReservationFormData = {
    email?: string | undefined |null;
    time: string;
    date : string;
}


type reservationSliceState = {
    reservationStatus: boolean;
    error: string | null;
    reservationsList: Record<string,string|number>[] | null;
}

const initialState : reservationSliceState ={
    reservationStatus: false,
    error: null,
    reservationsList : null,
}

export const createReservation = createAsyncThunk("users/create-reservation", async(payload : createReservationFormData, {rejectWithValue}) => {
    try{
        const { date, time } = payload;
    if (!date || !time) 
        return rejectWithValue("Date and time are required.");
    const selected = new Date(`${date}T${time}`);
    const now = new Date();
    if (selected < now) {
     return rejectWithValue("Invalid time.")
    }
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/create-reservations/`,payload, {
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

export const getReservations = createAsyncThunk("users/get-reservation", async(payload : string | null, {rejectWithValue}) => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/get-reservations/?user=${payload}`, {
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

const ReservationSlice = createSlice({
    name: "reservation",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(createReservation.pending, (state)=>{
            state.error = null;
            state.reservationStatus = false;
            state.reservationsList = null;
        })
        builder.addCase(createReservation.fulfilled,(state)=>{
            state.reservationStatus = true;
            state.error = null;
            state.reservationsList = null;
            toast.success("Congratulations! Your reservations are done.")
        })
        builder.addCase(createReservation.rejected,(state,action)=>{
            state.error = action.payload as string
            state.reservationStatus = false
            state.reservationsList = null;
            toast.error(state.error);
        })
        builder.addCase(getReservations.pending,(state)=>{
            state.error = null;
            state.reservationStatus = false;
            state.reservationsList = null;
        })
        builder.addCase(getReservations.fulfilled,(state,action)=>{
            state.error = null;
            state.reservationStatus = false;
            state.reservationsList = action?.payload;
        })
        builder.addCase(getReservations.rejected,(state,action)=>{
            state.error = action.payload as string
            state.reservationStatus = false
            state.reservationsList = null;
        })
        builder.addCase(logout,()=>{
            return initialState
        });
    }

})

export default ReservationSlice.reducer