import { createBrowserRouter,createRoutesFromElements,Route, RouterProvider  } from 'react-router-dom';
import Layout from './Layout'
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Menu from './Pages/Menu';
import Reservations from './Pages/Reservations';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout'
import Order from './Pages/Order';
import NotFound from './Pages/NotFound';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<SignUp/>}/>
      <Route path='menu' element={<Menu/>}/>
      <Route path='reservations' element={<Reservations/>}/>
      <Route path='cart' element={<Cart/>}/>
      <Route path='checkout' element={<Checkout/>}/>
      <Route path='orders' element={<Order/>}/>
   </Route>
      <Route path='*' element={<NotFound/>}/>
   </>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
