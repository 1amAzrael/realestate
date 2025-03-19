import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../Component/OAuth';

function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

// src/pages/Signin.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(signInStart());
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.success === false) {
      dispatch(signInFailure(data.message));
      return;
    }

    dispatch(signInSuccess(data));

    // Redirect admins to the admin dashboard
    if (data.isAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6"
        >
          Sign In
        </motion.h1>
        <p className="text-gray-500 text-center mb-8">
          Join <span className="font-semibold text-blue-600">RentPal</span> today and manage rentals like a pro!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              onChange={handleChange}
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-2 block w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-4 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:shadow-lg"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              onChange={handleChange}
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-2 block w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-4 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:shadow-lg"
            />
          </div>
          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-lg"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </motion.button>
          <OAuth />
        </form>
        <p className="text-gray-500 text-sm text-center mt-8">
          Don't have an account?{' '}
          <Link to={'/signup'} className="text-blue-600 font-medium hover:underline transition-all duration-300">
            Sign up
          </Link>
        </p>
        {error && <p className="text-red-500 text-sm text-center mt-8">{error}</p>}
      </motion.div>
    </div>
  );
}

export default Signin;
