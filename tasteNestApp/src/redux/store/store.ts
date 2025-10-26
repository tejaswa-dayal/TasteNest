import {configureStore} from '@reduxjs/toolkit';
import signUpReducer from '../features/SignUp/signUpSlice';
import logInReducer from '../features/Login/logInSlice';
import reservationReducer from '../features/Reservation/reservationSlice'
import dishesReducer from '../features/Dishes/DishesSlice'
import cartReducer from '../features/Cart/cartSlice'

export const store = configureStore({
    reducer : {
        signUp : signUpReducer,
        logIn: logInReducer,
        reservation: reservationReducer,
        dishes : dishesReducer,
        cart : cartReducer,
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;