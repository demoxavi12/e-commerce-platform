import React from 'react'

const NewsLetterBox = () => {
    const onSubmitHandler = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    }

    return (
        <div className=' text-center my-20 px-4'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
            <p className=' text-gray-400 mt-3'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <form onSubmit={onSubmitHandler} className='mt-8 sm:w-1/2 flex items-center gap-4 max-w-md mx-auto pl-4 border-1 border-gray-300 rounded-full shadow-lg'>
                <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required />
                <button
                    type="submit"
                    className=" cursor-pointer
                                bg-[#414141] text-white px-6 py-3
                                rounded-l-none rounded-r-full
                                text-sm font-medium tracking-wide
                                hover:bg-black transition-all duration-300
                                active:scale-95 shadow-lg"
                >
                    SUBSCRIBE
                </button>


            </form>
        </div>)
}

export default NewsLetterBox