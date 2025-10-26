
import { Outlet } from 'react-router-dom';
import {Navbar, Footer} from './components';
import { Toaster } from "react-hot-toast";
const Layout = () => {
  return (
    <>
    <Toaster position="top-center" />
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout
