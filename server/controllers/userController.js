import userModel from "../models/userModel.js";
import validator from "validator"
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken"


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

//route for user login
const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            message: 'email and password are reqired',
            success: false
        })
    }

    try {

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid email'
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const isMatch = await bycrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid password'
            })
        }else{
            return res.json({
                success: true,
                message: 'login successfully',
                token
            })
        }




        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.json({
            success: true,
            message: 'user has successfuly loged in'
        })



    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }


}

//routre for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;




        //checking if user already exist or not
        const exists = await userModel.findOne({ email })

        if (exists) {
            res.status(400).json({ success: false, message: "user already exists" })
        }




        //validating e-mail format & strong Password
        if (!validator.isEmail(email)) {
            res.status(400).json({ success: false, message: "Please fill a valid Email" })

        }
        if (password.length < 8) {
            res.status(400).json({ success: false, message: "Password must be atleast 8 characters long" })
        }


        //hashing user password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)



        //Creating a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })


        const user = await newUser.save()

        const token = createToken(user._id)

        res.status(200).json({ success: true, message: "User registered successfully", token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

//route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+ password, process.env.JWT_SECRET)
            res.json({ success: true, message: "Admin logged in successfully", token })
        
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}


export { loginUser, registerUser, adminLogin } 