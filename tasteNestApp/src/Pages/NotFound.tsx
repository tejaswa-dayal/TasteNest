import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../components'

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen pt-18 pb-12 bg-gradient-to-br from-(--gray-light)/30 via-white to-(--secondary-color)/10 flex items-center'>
      <Container>
        <div className='flex flex-col items-center justify-center text-center'>
          
          {/* Animated 404 */}
          <div className='relative mb-8'>
            <h1 className='text-[12rem] max-sm:text-[8rem] font-Oswald font-bold text-(--primary-color) leading-none relative'>
              404
              <span className='absolute inset-0 text-transparent bg-clip-text bg-gradient-to-br from-(--primary-color) to-(--secondary-color) blur-xl opacity-50'>
                404
              </span>
            </h1>
          </div>

          {/* Main Message */}
          <div className='mb-8 space-y-4'>
            <h2 className='text-4xl max-sm:text-2xl font-Oswald font-bold text-(--black-color)'>
              Oops! Page Not Found
            </h2>
            <div className='w-24 h-1.5 bg-(--secondary-color) rounded-full mx-auto'></div>
            <p className='text-lg max-sm:text-base text-(--gray-dark) max-w-md mx-auto'>
              Looks like you've wandered into uncharted territory. The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Illustration */}
          <div className='mb-10 text-9xl max-sm:text-7xl animate-bounce'>
            🍽️
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 max-sm:flex-col max-sm:w-full max-sm:px-4'>
            <Link 
              to='/'
              className='px-8 py-4 bg-(--primary-color) text-white rounded-xl font-bold text-lg hover:bg-(--primary-color)/90 transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden group'
            >
              <span className='relative z-10 flex items-center gap-2'>
                🏠 Go Home
              </span>
              <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></span>
            </Link>

            <button 
              onClick={() => navigate(-1)}
              className='px-8 py-4 border-2 border-(--primary-color) text-(--primary-color) rounded-xl font-bold text-lg hover:bg-(--primary-color)/5 transition-all duration-300 hover:scale-105'
            >
              ← Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className='mt-12 pt-8 border-t border-(--gray-light) w-full max-w-2xl'>
            <p className='text-sm text-(--gray-dark) mb-4 font-semibold'>Quick Links:</p>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              <Link 
                to='/menu'
                className='p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group'
              >
                <div className='text-3xl mb-2 group-hover:scale-110 transition-transform'>🍕</div>
                <p className='text-sm font-semibold text-(--black-color)'>Menu</p>
              </Link>

              <Link 
                to='/cart'
                className='p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group'
              >
                <div className='text-3xl mb-2 group-hover:scale-110 transition-transform'>🛒</div>
                <p className='text-sm font-semibold text-(--black-color)'>Cart</p>
              </Link>

              <Link 
                to='/orders'
                className='p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group'
              >
                <div className='text-3xl mb-2 group-hover:scale-110 transition-transform'>📦</div>
                <p className='text-sm font-semibold text-(--black-color)'>Orders</p>
              </Link>

              <Link 
                to='/reservations'
                className='p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group'
              >
                <div className='text-3xl mb-2 group-hover:scale-110 transition-transform'>📅</div>
                <p className='text-sm font-semibold text-(--black-color)'>Reservations</p>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default NotFound