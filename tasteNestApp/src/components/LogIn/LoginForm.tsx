import  { useEffect, useState } from 'react'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import type { AppDispatch,RootState } from '../../redux/store/store';
import {Input,Button} from '../index'
import { logInUser } from '../../redux/features/Login/logInSlice';
import {Link,useNavigate} from 'react-router-dom'


const LoginFormSchema = z.object({
    email : z.email({
        error: (issue) => issue.input === "" ? "Email is required." : "Invalid email."
    }),
    password : z.string().min(8,"Password must be at least 8 characters long")
}).required({
  email: true,
  password: true
});

type LoginFormData = z.infer<typeof LoginFormSchema>


const LoginForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {register, handleSubmit,reset, formState:{errors, isSubmitting}} = useForm<LoginFormData>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues:{
            email: '',
            password: '',
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const {error,status} = useSelector((state:RootState)=> state.logIn)
    useEffect(()=>{
        if(status){
            reset();
            navigate('/');
        }
    }, [status, reset,navigate]);

    const handleLogin = async(data : LoginFormData) => {
       await dispatch(logInUser(data))
    }


  return (
    <div className='w-full flex justify-center items-center rounded-r-lg' >
      <form onSubmit={handleSubmit(handleLogin)} noValidate className='flex flex-col gap-3 justify-center items-center'>
       {error && (
                    <div className='bg-red-50 border-l-4 border-red-500 p-3 rounded-lg animate-shake'>
                        <div className='flex items-center gap-2'>
                            <span className='text-xl'>⚠️</span>
                            <p className='text-red-700 text-sm font-medium'>{error}</p>
                        </div>
                    </div>
                )}
        <Input placeholder='test@email.com'  {...register("email")}  label='📧 Email' className='outline-(--gray-light) outline-3 lg:w-96 hover:outline-(--gray-dark)' labelCss='text-xl '/>
        {
          errors.email?.message && (
            <p className='text-red-500 self-start'><span>❌</span>{errors.email?.message}</p>
          )
        }
        
        <Input placeholder='Enter Password'  {...register("password")}  label='🔒 Password' type={showPassword ? 'text' : 'password'} className='outline-(--gray-light) outline-3 lg:w-96 hover:outline-(--gray-dark) relative focus:ring-2 focus:ring-(--primary-color)/90' labelCss='text-xl '>
        {
          errors.password?.message && (
            <p className='text-red-500 self-start'><span>❌</span>{errors.password?.message}</p>
          )
        }
        <Button className='absolute top-1/2 right-0 text-2xl z-10' aria-label={showPassword ? 'Hide password' : 'Show password'} type='button' onClick={()=>setShowPassword((prev)=>!prev)}>{showPassword ? '👁️‍🗨️' : '👁️'}</Button>
        </Input>
        <Button type='submit' className={`bg-amber-400 px-8 py-2 text-(--navbar-black) hover:scale-105 transition-transform duration-300  disabled:cursor-not-allowed`} disabled={isSubmitting}>{
          isSubmitting ? "Logging In..." : "Log In"
          }</Button>
      <p>Don't have an account? <Link to={'/signup'} className='text-(--primary-color) relative before:content[""] before:w-0 hover:before:w-full before:h-0.5 before:bg-(--secondary-color)/60 before:rounded-2xl before:z-10 before:absolute before:-bottom-0 before:left-0 before:transition-all before:duration-300 '>Sign Up</Link></p>
      </form>
    </div>
  )
}

export default LoginForm
