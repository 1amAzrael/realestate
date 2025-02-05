import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const {currentUser} = useSelector((state) => state.user);
  console.log(currentUser)
  return (
    <header className='bg-slate-200 p-4 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto '>
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-2xl flex flex-wrap'>
            <span className='text-red-600'>Rent</span>
            <span className='text-blue-600'>pal</span>
        </h1>
        </Link>
        <form className='bg-slate-100 p-2 rounded-lg flex items-center'>
            <input className='bg-transparent focus:outline-none w-24 sm:w-64' 
            type="text" placeholder='Search...' />
            <FaSearch className='text-slate-400'/>
        </form>
        <ul className='flex gap-4 font-semibold text-sm sm:text-[18px]'>
            <Link to='/'>
            <li className='hidden sm:inline hover:text-red-600 cursor-pointer'>Home</li>
            </Link>
            
            <Link to='/about'>
            <li className='hidden sm:inline hover:text-red-600 cursor-pointer'>About</li>

            </Link>

            <Link to='/profile'>
            {currentUser ? (
                <img
                className='rounded-full w-8 h-8 object-cover '
                 src={currentUser.photoURL} alt="profile" 
                />
            ) : (
                
                <li className='hidden sm:inline hover:text-red-600 cursor-pointer'>Sign In</li>

               
            )}
            </Link>

          
        </ul>
        </div>
    </header>
  )
}

export default Header