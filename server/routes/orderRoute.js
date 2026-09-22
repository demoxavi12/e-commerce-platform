import express from "express";
import {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    verifyRazorpay
    
} from "../controllers/orderController.js";

import adminAuth from '../middleware/adminAuth.js'
import AuthUser from "../middleware/Auth.js"

const orderRouter = express.Router();


//Admin
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);


//pament 
orderRouter.post("/place", AuthUser, placeOrder);
orderRouter.post("/stripe", AuthUser, placeOrderStripe);
orderRouter.post("/razorpay", AuthUser, placeOrderRazorpay);

//user features
orderRouter.post("/userorders", AuthUser, userOrders);


orderRouter.post('/verify', AuthUser, verifyStripe)
orderRouter.post('/verifyRazorpay', AuthUser, verifyRazorpay)

export default orderRouter;

