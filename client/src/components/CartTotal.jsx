import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Tittle from './Tittle';

const CartTotal = () => {

    const { currecy, getCartAmount, shippingCost } = useContext(ShopContext);

    const subtotal = getCartAmount();
    const total = subtotal === 0 ? 0 : subtotal + shippingCost;

    return (
        <div className='w-full'>
            <div className=' pt-14'>
                <div className="text-center max-w-3xl mx-auto mb-14 px-4">
                    <Tittle text1="TOTAL" text2="AMOUNT" />
                </div>

                <div className='flex flex-col gap-2 mt-2 text-[20px] text-gray-600 mb-4 border-b border-gray-300 pb-4'>
                    <div className='flex justify-between'>
                        <p>Subtotal</p>
                        <p>{currecy} {subtotal}.00</p>
                    </div>
                </div>

                

                <div className='flex justify-between text-[20px] text-gray-600 mb-4 border-b border-gray-300 pb-4'>
                    <p>Shipping Fee</p>
                    <p>{currecy} {shippingCost}.00</p>
                </div>

                

                <div className='flex justify-between'>
                    <p className='text-gray-800 text-2xl'>Total</p>
                    <p className='text-gray-800 text-2xl' >{currecy} {total}.00</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal;
