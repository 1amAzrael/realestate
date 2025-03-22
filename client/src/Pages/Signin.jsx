"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"
import OAuth from "../Component/OAuth"
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi"

function Signin() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }

      dispatch(signInSuccess(data))

      // Redirect admins to the admin dashboard
      if (data.isAdmin) {
        navigate("/admin-dashboard")
      } else {
        navigate("/")
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 w-full max-w-md border border-gray-100 dark:border-gray-700"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
            Sign in to <span className="font-medium text-blue-600">RentPal</span> and continue managing your
            properties
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm"
          >
            <p className="flex items-center">
              <FiAlertCircle className="mr-2 text-lg" />
              {error}
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                onChange={handleChange}
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                onChange={handleChange}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2.5 px-4 text-white font-medium rounded-xl ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } transition-all duration-200 shadow-sm flex items-center justify-center`}
          >
            {loading ? (
              <>
                <span className="mr-2 animate-spin inline-block">◌</span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </motion.button>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative px-4 bg-white dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">or continue with</span>
            </div>
          </div>

          <OAuth />
        </form>

        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-8">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-600 font-medium hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Signin