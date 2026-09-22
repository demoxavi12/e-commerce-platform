import express from 'express'
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js'
import AuthUser from '../middleware/Auth.js'

const CartRouter = express.Router()

CartRouter.post('/get', AuthUser ,getUserCart)
CartRouter.post('/add', AuthUser ,addToCart)
CartRouter.post('/update', AuthUser ,updateCart)

export default CartRouter