

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";


//gateway initialize 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const currency = 'inr'
const deliveryCharges = 10





//placing order using COD method
const placeOrder = async (req, res) => {
    try {
        // Change userId to req.userId (coming from AuthUser middleware)
        const { items, amount, address } = req.body;
        const userId = req.userId;

        const orderdata = {
            userId: userId, // Now this is correctly populated
            address: address, // Ensure address is included in the model
            items: items,
            amount: amount,
            paymentMethod: "cod",
            payment: false, // Fixed typo: 'paymet' to 'payment'
            date: Date.now(),
        }

        const newOrder = new orderModel(orderdata);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.status(201).json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//placing order using Stripe method

const placeOrderStripe = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;

        const origin = req.headers.origin || "http://localhost:5174";


        const orderdata = {
            userId,
            address,
            items,
            amount,
            paymentMethod: "stripe", // ✅
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderdata);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Stripe needs amount in cents
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Order Fee",
                },
                unit_amount: deliveryCharges * 100,
            },
            quantity: 1,
        });

        try {
            const session = await stripe.checkout.sessions.create({
                success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
                line_items,
                mode: "payment",
            });

            res.status(200).json({ success: true, url: session.url });
        } catch (err) {
            console.error("Stripe session creation error:", err);
            res.status(500).json({ success: false, message: "Stripe session creation failed" });
        }



    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



//placing order using Razorpay method

const placeOrderRazorpay = async (req, res) => {

    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;




        const orderdata = {
            userId,
            address,
            items,
            amount,
            paymentMethod: "Razorpay", // ✅
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderdata);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toLocaleUpperCase(),
            receipt: newOrder._id.toStrig(),

        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error)
                res.json({ success: false, message: error.message })
            }
            res.json({ success: true, order })
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.userId;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true, message: "Payment Successful" })
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//all order data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, message: "All Orders", data: orders });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });

    }
}


//user data for frontEnd

const userOrders = async (req, res) => {
    try {
        const userId = req.userId; // ✅ from middleware

        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// update order status from admin panel

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    verifyRazorpay
}
