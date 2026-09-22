import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { backendUrl } from '../App';
import { toast  } from 'react-toastify';



const Login = ({setToken}) => {
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post(backendUrl + '/api/user/admin', {email, password})
      if(response.data.success){
        setToken(response.data.token)
      }else{
        toast.error(response.data.message)
      }
      } catch (error) {
          console.log(error)
          toast.error(error.message)
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8"
      >
        {/* Title */}
        <div className="text-center mb-15 ">
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <hr className='border-none h-[1.5px] w-8 bg-gray-500' />

            <h2 className="prata-regular text-2xl font-semibold tracking-wide">
              {state === "Sign Up" ? "Create Account" : "Welcome Back"}
            </h2>
            <hr className='border-none h-[1.5px] w-8 bg-gray-500' />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {state === "Sign Up"
              ? "Sign up to start shopping"
              : "Login to your account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <AnimatePresence>
            {state === "Sign Up" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Input
                  icon={assets.profile_icon}
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            icon={assets.mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={assets.password}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="text-xs text-gray-500 text-right cursor-pointer hover:text-black"
            >
              Forgot password?
            </p>
          )}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full mt-4 py-3 rounded-xl bg-black text-white text-sm tracking-widest hover:bg-gray-900 transition shadow-md"
          >
            {state === "Sign Up" ? "SIGN UP" : "LOGIN"}
          </motion.button>
        </form>

        {/* Switch */}
        <p className="text-center text-xs text-gray-500 mt-6">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="cursor-pointer text-black font-medium underline"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="cursor-pointer text-black font-medium underline"
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
};

/* ================= Reusable Input ================= */

const Input = ({ icon, type = "text", placeholder, value, onChange }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3">
    <img src={icon} alt="" className="w-4 opacity-70" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full text-sm outline-none bg-transparent"
      required
    />
  </div>
);

export default Login
