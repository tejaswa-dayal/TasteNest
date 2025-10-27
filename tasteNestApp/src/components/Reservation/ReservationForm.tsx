import {useEffect} from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import {Input,Button} from '../index';
import { useDispatch,useSelector } from 'react-redux';
import {createReservation} from '../../redux/features/Reservation/reservationSlice'
import type { AppDispatch,RootState } from '../../redux/store/store';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const reservationFormSchema = z.object({
    guests: z.string().min(1, "At least one guest is required."),
    date : z.string({error:(issue)=> issue.input === "" ? "Date is required." : "Invalid date."}),
    time : z.string({error:(issue)=> issue.input === "" ? "Time is required." :  "Invalid time."})
}).required(
    {
        guests: true,
        date: true,
        time: true
    }
)

type reservationFormData = z.infer<typeof reservationFormSchema> & {
    user_id?: string | undefined |null;
}



const ReservationForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {user_id,status} = useSelector((state: RootState)=> state.logIn)
    const {reservationStatus, error} = useSelector ((state: RootState) => state.reservation)
    const navigate = useNavigate();
    const {register, handleSubmit,reset, formState: {errors, isSubmitting}} = useForm<reservationFormData>({
              resolver: zodResolver(reservationFormSchema),
                defaultValues: {
                guests: '',
                date: '',
                time: '',
            }
        }
        );

        useEffect(() => {
      if (reservationStatus) {
        reset(); // Resets the form to its default values
      }
    }, [reservationStatus, reset]);
        const handleReservation = async(data:reservationFormData)=>{
            if (status){
                data = {
                    ...data,
                    user_id : user_id
                }
                await dispatch(createReservation(data));
            }
            else{
                toast.error("Login to reserve a table.")
                setTimeout(() => {
      navigate("/login");
    }, 2000);
            }
            
        }
        
  return (
    <form className='grid grid-cols-1 gap-3' noValidate onSubmit={handleSubmit(handleReservation)}>
        <p className='text-red-500 text-xs'>{errors.date?.message || errors.guests?.message || errors.time?.message || error}</p>
      <div className='col-span-2'>
      <Input type='number' placeholder='No of Guest' className='bg-white rounded-sm py-2  col-span-2 row-span-1 outline-(--gray-light) grow' min='0' {...register("guests")}/>
      </div>
      <div className=' col-span-2 grid-cols-2 max-sm:grid-cols-1 grid gap-4 max-sm:gap-3'>
        <div className='col-span-1'>
      <Input type='date' className=' bg-white rounded-sm py-2 outline-(--gray-light) text-(--black-color)/50 max-sm:grow' {...register("date")} min={new Date().toISOString().split('T')[0]}/>
        </div>
        <div className='col-span-1'>
      <Input type='time' className=' bg-white rounded-sm py-2 outline-(--gray-light) text-(--black-color)/50 max-sm:grow' {...register("time")}/>
        </div>
        <div className='col-span-1'>
            <Button type='submit' className='z-10 bg-(--primary-color) text-white font-semibold px-3 py-2 relative hover:scale-105 transition-all duration-700 before:absolute before:content[""] before:h-12 before:w-full before:border-2 before:border-(--primary-color) before:rounded-lg before:-z-10 before:-top-1 before:-right-2  hover:before:w-[20%] before:transition-all before:duration-700' >{isSubmitting? "Reserving a table" : "Reserve a Table"}
            </Button>
        </div>
      </div>
    </form>
  )
}

export default ReservationForm
