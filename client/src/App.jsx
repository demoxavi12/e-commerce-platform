import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Cart from './pages/Cart.jsx'
import Orders from './pages/Orders.jsx'
import Collection from './pages/Collection.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Product from './pages/Product.jsx'
import PlaceOrder from './pages/PlaceOrder.jsx'
import Navbar from './components/Navbar.jsx'
import Profile from './pages/Profile.jsx'
import Footer from './components/Footer.jsx'
import { Search } from 'lucide-react'
import Searchbar from './components/Searchbar.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify.jsx'


const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] 1g:px-[9vw]'>
      <ToastContainer />

      <ScrollToTop />
      <Navbar />
      <Searchbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-orders' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/verify" element={<Verify/>} />

      </Routes>
      <Footer />

    </div>
  )
}

export default App
