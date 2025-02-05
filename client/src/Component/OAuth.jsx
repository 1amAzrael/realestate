import React from 'react'
import { motion } from 'framer-motion'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'

import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
          const auth = getAuth(app);
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);

          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: result.user.displayName, 
                email: result.user.email,
                photoURL: result.user.photoURL,}),
          });
          const data = await res.json();
          dispatch(signInSuccess(data));
          navigate('/');
          
        } catch (error) {
          console.log(error);
        }
      };

      
  return (
    <motion.button
          type='button'
          onClick={handleGoogleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-red-500 to-green-600 hover:from-green-600 hover:to-red-500 transition-all duration-300 shadow-lg"
          >
            Continue with google
          </motion.button>
  )
}

export default OAuth