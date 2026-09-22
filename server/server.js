import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/ProductRoutes.js'
import CartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'


//app config

const app = express()

const port = process.env.PORT || 4000
connectDB()
connectCloudinary

// middleware

app.use(express.json())
app.use(cors())


//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product', productRouter )
app.use('/api/cart', CartRouter )
app.use('/api/order', orderRouter )


app.get('/', (req, res)=>{
    res.send("API WORKING")

}) 

app.listen(port, ()=>console.log('Server stared on port: '+port))