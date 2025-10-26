import {useEffect, useState} from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import {Input,Button} from '../index';
import { useDispatch,useSelector } from 'react-redux';
import { signUpUser } from '../../redux/features/SignUp/signUpSlice';
import type { AppDispatch,RootState } from '../../redux/store/store';
import { Link,useNavigate } from 'react-router-dom';


const SignUpFormSchema = z.object({
    name : z.string().min(1,"Name is required"),
    email: z.email({  error: (issue) => issue.input === "" ? "Email is required." : "Invalid email."
    }),
    password : z.string().min(8,"Password must be at least 8 characters long")
}).required({
  name: true,
  email: true,
  password: true
})


type SignUpFormData = z.infer<typeof SignUpFormSchema>

const SignUpForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {successMessage,error} = useSelector((state:RootState)=> state.signUp);
    const [showPassword, setShowPassword] = useState(false);
    const {register, handleSubmit,reset, formState: {errors, isSubmitting}} = useForm<SignUpFormData>(
        {
          resolver: zodResolver(SignUpFormSchema),
            defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    }
    );
        useEffect(() => {
      if (successMessage) {
        reset(); // Resets the form to its default values
        navigate('/');
      }
    }, [successMessage, reset,navigate]);
    const handleSignUp = async(data: SignUpFormData) => {
        await dispatch(signUpUser(data));
    }

  return (
    <div className='w-full flex justify-center items-center rounded-r-lg'>
      <form onSubmit={handleSubmit(handleSignUp)} noValidate className='flex flex-col gap-3 justify-center items-center'>
        {error && <p className='text-red-500'><span>❌</span>{error}</p>}
        <Input placeholder='Enter Fullname' {...register("name")}  label='👤 Fullname' className='outline-(--gray-light) outline-3 lg:w-96 hover:outline-(--gray-dark)' labelCss='text-xl '/>
        {
          errors.name?.message && (
            <p className='text-red-500 self-start'><span>❌</span>{errors.name?.message}</p>
          )
        }
      <Input placeholder='test@email.com'  {...register("email")}  label='📧 Email' className='outline-(--gray-light) outline-3 lg:w-96 hover:outline-(--gray-dark)' labelCss='text-xl '/>
        {
          errors.email?.message && (
            <p className='text-red-500 self-start'><span>❌</span>{errors.email?.message}</p>
          )
        }
       <Input placeholder='Enter Password'  {...register("password")}  label='🔒 Password' type={showPassword ? 'text' : 'password'} className='outline-(--gray-light) outline-3 lg:w-96 hover:outline-(--gray-dark) relative focus:ring-2 focus:ring-(--primary-color)/90' labelCss='text-xl '>
        <Button className='absolute top-1/2 right-0 text-2xl z-10' aria-label={showPassword ? 'Hide password' : 'Show password'} type='button' onClick={()=>setShowPassword((prev)=>!prev)}>{showPassword ? '👁️‍🗨️' : '👁️'}</Button>
        </Input>
        {
          errors.password?.message && (
            <p className='text-red-500 self-start'><span>❌</span>{errors.password?.message}</p>
          )
        }
        <Button type='submit' className={`${
          isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
          } bg-amber-400 px-8 py-2 text-(--navbar-black) hover:scale-105 transition-transform duration-300 disabled:cursor-not-allowed`} disabled={isSubmitting}>{
          isSubmitting ? "Signing Up..." : "Sign Up"
          }</Button>
          <p>Already have an account? <Link to={'/login'} className='text-(--primary-color) relative before:content[""] before:w-0 hover:before:w-full before:h-0.5 before:bg-(--secondary-color)/60 before:rounded-2xl before:z-10 before:absolute before:-bottom-0 before:left-0 before:transition-all before:duration-300 '>Log In</Link></p>
      </form>
    </div>
  )
}

export default SignUpForm
