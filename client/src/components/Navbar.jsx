import React, { useContext, useState } from 'react'
import assets from '../assets/assets.js'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx'
const Navbar = () => {

    const [visible, setVisible] = useState(false)

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setCartItems({})
        navigate('/login')


    }


    return (
        <div className='relative flex items-center justify-between py-5 font-medium'>

            <Link to={'/'}><img src={assets.logo} className='w-36' alt="logo" draggable={false} /></Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p >HOME</p> <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>COLLECTIONS</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p> <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p> <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img

                    onClick={() => setShowSearch(true)}
                    src={assets.search_icon}
                    className="w-5 cursor-pointer transition-transform duration-200 hover:scale-110"
                    alt="Search"
                />
                <div className="group relative">
                    {/* Profile Icon */}
                    <img onClick={()=> token ? null : navigate('/login')}
                        className="w-5 cursor-pointer transition-transform duration-200 group-hover:scale-110"
                        src={assets.profile_icon}
                        alt="profile"
                    />

                    {/* Hover buffer wrapper */}
                    { token && 
                                        <div className="absolute right-0 top-full pt-3 z-100
                                    opacity-0 scale-95 translate-y-2
                                    pointer-events-none
                                    transition-all duration-200 ease-out
                                    group-hover:opacity-100
                                    group-hover:scale-100
                                    group-hover:translate-y-0
                                    group-hover:pointer-events-auto">
                        {/* Dropdown */}
                        <div
                            className="w-60 rounded-xl bg-gray-100 backdrop-blur-md shadow-2xl ring-1 ring-white/10">
                            <div className="flex flex-col gap-2 p-2 text-gray-500">
                                <NavLink to={'/profile'}>
                                    <p className="px-4 py-2 rounded-lg cursor-pointer transition-all
                              text-black/70 hover:bg-gray-200 hover:text-black">
                                        PROFILE
                                    </p>
                                </NavLink>


                                <NavLink to={'/orders'}>
                                    <p className="px-4 py-2 rounded-lg cursor-pointer transition-all
                              text-black/70 hover:bg-gray-200 hover:text-black">
                                        ORDERS
                                    </p>

                                </NavLink>

                                <p onClick={logout} className="px-4 py-2 rounded-lg cursor-pointer transition-all
                              text-black/70 hover:bg-red-200 hover:text-red-500">
                                    LOG-OUT
                                </p>
                            </div>
                        </div>
                    </div>}
                </div>

                <Link to={'/cart'} className='relative'>
                    <img
                        src={assets.cart_icon}
                        className="w-5 cursor-pointer transition-transform duration-200 hover:scale-110"
                        alt="Cart"
                    />
                    <p className='absolute right-[-5px] bottom-[-5px] text-center rounded-full  bg-red-500 text-white text-xs w-4 h-4'>
                        {getCartCount()}
                    </p>

                </Link>

                <img onClick={() => setVisible(v => !v)} src={assets.menu_icon} className="w-5 sm:hidden cursor-pointer transition-transform duration-200 hover:scale-110" alt="" />

            </div>


            {/* sidebar menu for smaller screen */}


            <div
                className={`
                        absolute right-0 top-4 left-0 z-100
                        w-full rounded-xl bg-gray-100 backdrop-blur-md shadow-2xl
                        transform transition-all duration-200 ease-out
                        ${visible
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
  `}
            >
                <div className="relative text-center flex flex-col gap-2 p-2">

                    {/* Close / Dropdown Icon */}
                    <img
                        src={assets.dropdown_icon}
                        alt="close"
                        className="absolute right-2 top-2 w-5 cursor-pointer hover:scale-110 transition"
                        onClick={() => setVisible(false)}   // optional: close menu
                    />

                    <NavLink onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg cursor-pointer border-b-1 border-gray-400 rounded-t-lg rounded-b-none mt-6" to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg cursor-pointer border-b-1 border-gray-400 rounded-t-lg rounded-b-none" to='/collection'> COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg cursor-pointer border-b-1 border-gray-400 rounded-t-lg rounded-b-none" to='/about'> ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg cursor-pointer border-b-1 border-gray-400 rounded-t-lg rounded-b-none" to='/contact'> CONTACT</NavLink>
                    { token && <NavLink onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg cursor-pointer border-b-1 border-gray-400 rounded-t-lg rounded-b-none" to='/orders'>ORDERS</NavLink>}
                    { token && <NavLink onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg cursor-pointer border-b-1 border-gray-400 rounded-t-lg rounded-b-none" to='/profile'> PROFILE</NavLink>}
                    <NavLink onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg cursor-pointer bg-red-500 text-red-500" onClick={logout}> LOG-OUT</NavLink>

                </div>

            </div>

        </div >)
}
export default Navbar