import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,

    },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },

    address: {
        type: Object, reqired: true,
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    paymentMethod: {
        type: String,
        required: true
    },
    payment: {
        type: Boolean, reqired: true, default: false

    },
    date:{
        type: Number, required: true, default: Date.now
    }

})

const orderModel = mongoose.model.order || mongoose.model("order", orderSchema); 

export default orderModel;