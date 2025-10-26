import { Link, NavLink } from 'react-router-dom'
import {Container, Button} from '../index'
import tasteNestLogo from '/tasteNestLogo.png'
import CartIcon from '../../assets/Navbar/cartIcon.svg?react'
import { Cross as Hamburger } from 'hamburger-react'
import { useState } from 'react'
import { motion } from "motion/react"
import { useSelector, useDispatch} from 'react-redux';
import { type RootState, type AppDispatch } from '../../redux/store/store'
import { logout } from '../../redux/actions/globalAction';

const Navbar = () => {
  const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
  const {status,name,user_id} = useSelector((state:RootState)=> state.logIn)
  const {dishesInCartCount} = useSelector((state:RootState) => state.cart)
  const dispatch = useDispatch<AppDispatch>();
  return (
    <nav className="w-full bg-white shadow-md fixed z-20  font-Oswald">
      <Container className='grid grid-cols-2 lg:grid-cols-3 place-items-center !py-3'>
        <div className='col-span-1 place-self-start 'data-aos="zoom-out-right">
          <Link to={'/'}>
          <img src={tasteNestLogo} alt="" className='w-24 object-contain'/>
          </Link>
        </div>
        <div className='lg:hidden col-span-1 flex justify-between gap-4'>
          <NavLink to={'/cart'} className={'flex items-center relative'}>
            <CartIcon className='text-[#00A149] w-10 h-6 hover:text-(--primary-color) hover:scale-115 transition-all duration-200'/>
            <h6 className='pt-0.3 h-5 w-5 rounded-full absolute top-0 -right-0.5 bg-(--secondary-color) text-white text-[0.7rem] text-center font-black'>{dishesInCartCount}</h6>
            </NavLink>
         <Hamburger color='var(--primary-color)' size={40} onToggle={(toggled) => {
          if(toggled) 
            {
              
              setShowMobileNav(true)
            } 
          else
            {
              setShowMobileNav(false);
            }
            }}/>
             
        </div>
        {/* Large Screens Navbar */}
        <div className='w-full max-lg:hidden col-span-1' >
        <ul className='flex items-center gap-6 justify-self-center justify-center' data-aos="fade-down" data-aos-duration="900">
          <li>
<NavLink to='/' className={({isActive})=> `${isActive ? 'text-(--primary-color)' : 'text-(--navbar-black)'} font-semibold hover:text-(--primary-color) transition-colors duration-200`}>Home</NavLink>
          </li>
          <li>
             <NavLink to='/menu' className={({isActive})=> `${isActive ? 'text-(--primary-color)' : 'text-(--navbar-black)'} font-semibold hover:text-(--primary-color) transition-colors duration-200`}>Menu</NavLink>
          </li>
           <li>
            <NavLink to='/orders' className={({isActive})=> `${isActive ? 'text-(--primary-color)' : 'text-(--navbar-black)'} font-semibold hover:text-(--primary-color) transition-colors duration-200`}>Orders</NavLink>
          </li>
          <li>
            <NavLink to='/reservations' className={({isActive})=> `${isActive ? 'text-(--primary-color)' : 'text-(--navbar-black)'} font-semibold hover:text-(--primary-color) transition-colors duration-200`}>Reservations</NavLink>
          </li>
        </ul>
    </div>
        <div className='w-full flex items-center gap-4 col-span-1 max-lg:hidden place-content-end'>
          <NavLink to={'/cart'} className={'flex items-center relative'}>
            <CartIcon className='text-[#00A149] w-10 hover:text-(--primary-color) hover:scale-115 transition-all duration-200'/>
            <h6 className='pt-0.3 h-5 w-5 rounded-full absolute -top-3  -right-0.5 bg-(--secondary-color) text-white text-[0.7rem] text-center font-black'>{dishesInCartCount}</h6>
            </NavLink>
            {
              status ? (<>
              <p className="text-(--gray-dark)">Welcome, <span className="text-(--primary-color) capitalize">{name}</span></p>
               <Button className='hover:bg-(--primary-color) px-5 py-1 shadow-lg text-(--navbar-black) hover:text-white outline-2 outline-(--primary-color) transition-all duration-300 hover:scale-105 hover:outline-none' onClick={()=> dispatch(logout())}>Log out</Button>
              </>) :(
                <>
                <NavLink to={'/signup'} className={'hover:text-(--primary-color) text-(--navbar-black) transition-all duration-200 hover:scale-105'}>
            Sign Up
          </NavLink>
          <Link to={'/login'}>
            <Button className='hover:bg-(--primary-color) px-5 py-1 shadow-lg text-(--navbar-black) hover:text-white outline-2 outline-(--primary-color) transition-all duration-300 hover:scale-105 hover:outline-none'>Log In</Button>
          </Link>
                </>
              )
            }
          
        </div>
          {/* Mobile Navbar */}
            <motion.div className='h-[100vh] min-w-[50vw] absolute top-0 left-0 bg-white flex flex-col items-center gap-8 lg:hidden px-7 py-2.5 z-30 border-r-2 border-(--gray-light) shadow-lg'
            animate={showMobileNav ? {x:'0'} : {x:'-100%'}}
            transition={{type:'spring', stiffness:300, damping:30}}
            initial={false}
            >
                <Link to={'/'}>
          <img src={tasteNestLogo} alt="" className='w-40 object-contain'/>
          </Link>
          <ul className='flex flex-col gap-8 items-center justify-center text-xl w-full overflow-y-scroll'>
            <li className='w-full flex justify-center items-center gap-3 mt-4.5'>
              { status ? (<>
              <p className="text-(--gray-dark)">Welcome, <span className="text-(--primary-color) capitalize">{name}</span></p>
              </>) :(
                <>
              <Link to={'/signup'} className='text-(--navbar-black) px-3 py-0.5 outline-2 outline-(--secondary-color) rounded-lg hover:text-white hover:bg-(--secondary-color) transition-all duration-300'>
              Sign Up
              </Link>
              <span className='w-0.5 h-14 bg-(--gray-light) rotate-6'/>
              <Link to={'/login'}>
              <Button className='w-full hover:bg-(--primary-color) px-3 py-0.5 shadow-lg text-(--navbar-black) hover:text-white outline-2 outline-(--primary-color) transition-all duration-300 hover:scale-105 hover:outline-none'>Log In</Button>
              </Link>
                </>
              )}
            </li>
             <li className='w-full border-b-2 border-(--gray-light)'/>
             <li>
<NavLink to='/' className={({isActive})=> `${isActive ? 'text-(--primary-color)' : 'text-(--navbar-black)'} font-semibold hover:text-(--primary-color) transition-colors duration-200`}>Home</NavLink>
          </li>
          <li className='w-full border-b-2 border-(--gray-light)'/>
          <li>
             <NavLink to='/menu' className={({isActive})=> `${isActive ? 'text-(--primary-color)' : 'text-(--navbar-black)'} font-semibold hover:text-(--primary-color) transition-colors duration-200`}>Menu</NavLink>
          </li>
          <li className='w-full border-b-2 border-(--gray-light)'/>
          <li>
            <NavLink to='/orders' className={({isActive})=> `${isActive ? 'text-(--primary-color)' : 'text-(--navbar-black)'} font-semibold hover:text-(--primary-color) transition-colors duration-200`}>Orders</NavLink>
          </li>
          <li className='w-full border-b-2 border-(--gray-light)'/>
          <li>
            <NavLink to='/reservations' className={({isActive})=> `${isActive ? 'text-(--primary-color)' : 'text-(--navbar-black)'} font-semibold hover:text-(--primary-color) transition-colors duration-200`}>Reservations</NavLink>
          </li>
          <li className='w-full border-b-2 border-(--gray-light)'/>
              {user_id && <Button className='w-full bg-(--primary-color) px-3 py-1 shadow-lg text-white outline-2 outline-(--primary-color) ' onClick={()=> dispatch(logout())}>Logout</Button>}
          </ul>

              </motion.div>
      </Container>
    </nav>
  )
}

export default Navbar
