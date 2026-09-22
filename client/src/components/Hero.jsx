import React, { useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";


const slides = [
    {
        img: assets.hero_img3,
        title: "Valentine Vibes",
        subtitle: "Perfect looks for your special day",
        position: "bottom-center",
        gradient: "from-black/80 via-black/40 to-transparent",
    },

    {
        img: assets.hero_img2,
        title: "Minimal Luxe",
        subtitle: "Clean designs. Maximum impact.",
        position: "center",
        gradient: "from-black/60 via-black/40 to-black/60",
    },

    {
        img: assets.hero_img1,
        title: "Street Ready",
        subtitle: "Urban fits for everyday style",
        position: "bottom-left",
        gradient: "from-black/70 via-black/30 to-transparent",
    },
    {
        img: assets.hero_img4,
        title: "New Essentials",
        subtitle: "Timeless pieces for every wardrobe",
        position: "top-left",
        gradient: "from-black/70 via-black/30 to-transparent",
    },
    {
        img: assets.hero_img5,
        title: "Masculine Edge",
        subtitle: "Rugged styles with refined details",
        position: "center-right",
        gradient: "from-black/70 via-black/40 to-transparent",
    },
];

const Hero = () => {
    const [current, setCurrent] = useState(0);

    // auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="relative overflow-hidden">
            {/* gradient background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-200" />

            <div className="relative flex flex-col sm:flex-row items-center border border-gray-300">
                {/* hero left */}
                <div className="w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0 order-2 sm:order-1">
                    <div className="text-[#414141] text-center sm:text-left px-4">

                        {/* Bestseller Tag */}
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                            <span className="w-10 h-[2px] bg-[#414141]"></span>
                            <p className="uppercase tracking-widest text-xs md:text-sm font-semibold">
                                Our Bestsellers
                            </p>
                            <span className="w-10 h-[2px] bg-[#414141]"></span>
                        </div>

                        {/* Heading */}
                        <h1 className="prata-regular text-4xl leading-tight sm:text-5xl lg:text-6xl">
                            Latest <br className="sm:hidden" /> Arrivals
                        </h1>

                        {/* Description */}
                        <p className="mt-4 text-gray-600 max-w-md mx-auto sm:mx-0 text-sm sm:text-base">
                            Discover premium collections curated just for you. Elevate your style
                            with our newest arrivals.
                        </p>

                        {/* CTA */}
                        <div className="mt-6 flex items-center justify-center sm:justify-start gap-4">
                            <button className=" cursor-pointer
                                                bg-[#414141] text-white px-6 py-3 rounded-full
                                                text-sm font-medium tracking-wide
                                                hover:bg-black transition-all duration-300
                                                active:scale-95 shadow-lg">
                                Shop Now
                            </button>

                            <span className="hidden sm:block w-12 h-[1px] bg-[#414141]"></span>
                        </div>
                    </div>
                </div>




                {/* hero right - carousel */}
                <div className="relative w-full sm:w-1/2 h-[350px] sm:h-[450px] overflow-hidden order-1 sm:order-2">

                    {slides.map((slide, index) => (
                        <div key={index} className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
                            <img
                                src={slide.img}
                                alt="hero"
                                className="w-full h-full object-cover"
                            />

                            {/* text overlay */}
                            <div className="absolute inset-0 bg-black/25 flex items-end p-6 sm:p-10">
                                <div className="text-white animate-fadeInUp">
                                    <h2 className="prata-regular text-2xl sm:text-4xl font-bold">
                                        {slide.title}
                                    </h2>
                                    <p className="mt-1 text-sm sm:text-base text-gray-200">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* left button */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* right button */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, i) => (
                            <span
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer
                  ${i === current ? "w-6 bg-[#414141]" : "w-2 bg-gray-400"}`}
                                onClick={() => setCurrent(i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

