import React from 'react'
import { Link } from 'react-router-dom';
import bannerDesktop from '../assets/ninja_masked_banner_desktop.png';
import bannerMobile from '../assets/ninja_masked_banner_mobile.png';
import Tittle from './Tittle';

const NInjaMask = () => {
    return (
        <div>
            <div className="text-center max-w-3xl mx-auto mb-14 px-4">
                <Tittle text1={"LIMITED"} text2={"EDITIONS"} />
                
            </div>
    <Link to="/product/ninja-masked-zipper-black-hoodie">
      <div
        className="
          relative w-full overflow-hidden
          flex items-center justify-center
        "
      >
        {/* Desktop Image */}
        <div className="hidden md:block w-full">
          <img
            src={bannerDesktop}
            alt="Ninja Masked Zipper Black Hoodie"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Mobile Image */}
        <div className="block md:hidden w-full">
          <img
            src={bannerMobile}
            alt="Ninja Masked Zipper Black Hoodie"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Optional Content Overlay (kept empty like original) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Add text/buttons here later if needed */}
        </div>
      </div>
    </Link>
    </div>
  );
}

export default NInjaMask
