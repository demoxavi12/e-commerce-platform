import React from 'react'
import assets from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'


const Navbar = ({setToken}) => {
  return (
    <div className='relative flex items-center justify-between py-5 font-medium border-b border-gray-300'>


      <Link to={'/'}><img src={assets.logo} className='w-36' alt="logo" draggable={false} /></Link>
      <div className="flex items-center justify-center sm:justify-start gap-4">
        <button onClick={()=> setToken('')} className=" cursor-pointer
                                                bg-[#414141] text-white px-6 py-3 rounded-full
                                                text-sm font-medium tracking-wide
                                                hover:bg-black transition-all duration-300
                                                active:scale-95 shadow-lg">
          Log-Out
        </button>


      </div>
    </div>
  )
}

export default Navbar