import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(ShopContext);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        console.log("Login response:", response.data);

        if (response.data.success) {
          // login successful
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
          navigate("/"); // redirect
        } else {
          // login failed
          toast.error(response.data.message || "Invalid credentials");
        }
      } else if (state === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          console.log("Sign Up successful:", response.data);
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);

          toast.success("Registration successful!");
          navigate("/"); // redirect after signup
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };



  useEffect(() => {
    if (token) {
      navigate("/"); // redirect to home page if token is present
    }
  }, [token]);



  return (
    <div className=" flex items-center justify-center px-4 border-t border-gray-300">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl mt-15 p-6 sm:p-8"
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
