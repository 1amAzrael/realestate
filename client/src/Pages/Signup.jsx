import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../Component/OAuth';


function Signup() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange =  (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success == false) {
      setLoading(false);
      setErrors(data.message);
      
      return;
    }
    setLoading(false);
    console.log(data);
    setErrors(null);
    navigate('/signin');
      
    } catch (error) {
      setLoading(false);
      setErrors(error.message);
      
    }
    
  }
  
  
  return (
    <div className="flex items-center justify-center min-h-screen ">
      
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
          Sign Up
        </motion.h1>

        <p className="text-gray-500 text-center mb-8">
          Join <span className="font-semibold text-blue-600">RentPal</span> today and manage rentals like a pro!
        </p>

        
        <form onSubmit={handleSubmit} className="space-y-6">
        
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
            onChange={handleChange}
              id="username"
              type="text"
              placeholder="Enter your username"
              className="mt-2 block w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-4 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:shadow-lg"
            />
          </div>

         
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
          disabled = {loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-lg"
          >
           {loading ? 'Loading...' : 'Sign Up'}
          </motion.button>
          <OAuth/>
        </form>

        
        <p className="text-gray-500 text-sm text-center mt-8">
          Already have an account?{' '}
          <Link to={'/signin'}
            
            className="text-blue-600 font-medium hover:underline transition-all duration-300"
          >
            Log in
          </Link>
        </p>
        {errors && <p className="text-red-500 text-sm text-center mt-8">{errors}</p>}

      </motion.div>
    </div>
  );
}

export default Signup;
