import React, { use, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import { useLocation } from 'react-router-dom';

const Searchbar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();
 
    useEffect(() => {
       if (location.pathname.includes('collection') ) {
        setVisible(true);
       }
       else {
        setVisible(false);
       }
    }, [location]);

    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
      ${showSearch && visible ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}
    `}
        >
            <div className="border-t border-gray-300 bg-gray-50 text-center">
                <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 lg:w-1/3">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="SEARCH"
                        className="flex-1 outline-none bg-inherit text-sm"
                    />
                    <img className="w-4" src={assets.search_icon} alt="" />
                </div>

                <img
                    onClick={() => setShowSearch(false)}
                    src={assets.cross_icon}
                    className="inline w-3 cursor-pointer"
                    alt=""
                />
            </div>
        </div>
    );

}

export default Searchbar