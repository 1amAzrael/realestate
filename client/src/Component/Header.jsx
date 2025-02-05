import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Left Section: Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <h1 className="font-bold text-xl">
              <span className="text-red-600">Rent</span>
              <span className="text-blue-600">pal</span>
            </h1>
          </Link>
          <ul className="hidden sm:flex gap-4 font-semibold text-sm">
            <li>
              <Link to="/" className="hover:text-red-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-red-600">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Search Bar & Profile/Sign In */}
        <div className="flex items-center gap-4">
          <form className="flex items-center bg-slate-100 rounded-lg p-2">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-32 sm:w-64"
            />
            <FaSearch className="text-slate-400" />
          </form>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.photoURL}
                alt="profile"
                className="rounded-full w-8 h-8 object-cover"
              />
            ) : (
              <span className="font-semibold text-sm hover:text-red-600 cursor-pointer">
                Sign In
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
