import React from "react";
import Tittle from "./Tittle";
import assets from "../assets/assets";

const TopBrands = () => {

  // ✅ Same structure as BrandsCollection.jsx
  const brands = [
    {
      id: "hm",
      name: "H&M",
      image: assets.handm,
    },
    {
      id: "adidas",
      name: "ADIDAS",
      image: assets.adiddas,
    },
    {
      id: "calvin-klein",
      name: "CALVIN KLEIN",
      image: assets.calvin,
    },
    {
      id: "lacoste",
      name: "LACOSTE",
      image: assets.lacoste,
    },
    {
      id: "gucci",
      name: "GUCCI",
      image: assets.gucci,
    },
    {
      id: "nike",
      name: "NIKE",
      image: assets.nike,
    },
  ];

  return (
    <div className="w-full overflow-hidden py-10 bg-white">
      <div className="text-center max-w-3xl mx-auto mb-14 px-4">
        <Tittle text1={"TOP"} text2={"BRANDS"} />
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Marquee Track */}
        <div className="flex w-max animate-marquee gap-12">
          {/* First set */}
          {brands.map((brand, index) => (
            <div
              key={`brand-1-${brand.id}-${index}`}
              className="flex items-center justify-center min-w-[140px] opacity-80"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="h-14 sm:h-14 object-contain"
                draggable={false}
              />
            </div>
          ))}

          {/* Duplicate set for seamless loop */}
          {brands.map((brand, index) => (
            <div
              key={`brand-2-${brand.id}-${index}`}
              className="flex items-center justify-center min-w-[140px] opacity-80"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="h-12 sm:h-14 object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TopBrands;
