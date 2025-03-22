"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../Component/OAuth"

function Signup() {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    // Clear the error for the field when the user starts typing
    setErrors({ ...errors, [e.target.id]: "" })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long"
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success == false) {
        setLoading(false)
        setErrors({ form: data.message })
        return
      }
      setLoading(false)
      console.log(data)
      setErrors({})
      navigate("/signin")
    } catch (error) {
      setLoading(false)
      setErrors({ form: error.message })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 w-full max-w-md border border-slate-100"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Create Account
          </h1>
          <p className="text-slate-500 text-center text-sm">
            Join <span className="font-medium text-indigo-600">RentPal</span> today and manage rentals like a pro!
          </p>
        </motion.div>

        {errors.form && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm"
          >
            <p className="flex items-center">
              <span className="mr-2 text-lg">⚠️</span>
              {errors.form}
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="relative">
              <input
                onChange={handleChange}
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 text-slate-800 bg-white"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative">
              <input
                onChange={handleChange}
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 text-slate-800 bg-white"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                onChange={handleChange}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 text-slate-800 bg-white"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2.5 px-4 text-white font-medium rounded-xl ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } transition-all duration-200 shadow-sm flex items-center justify-center`}
          >
            {loading ? (
              <>
                <span className="mr-2 animate-spin inline-block">◌</span>
                Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </motion.button>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative px-4 bg-white">
              <span className="text-sm text-slate-500">or continue with</span>
            </div>
          </div>

          <OAuth />
        </form>

        <p className="text-slate-600 text-sm text-center mt-8">
          Already have an account?{" "}
          <Link to={"/signin"} className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Signup