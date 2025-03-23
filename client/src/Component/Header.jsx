// Header.jsx
import React, { useEffect, useState, useRef } from 'react';
import { FaSearch, FaUserCircle, FaBars, FaTimes, FaHome, FaInfoCircle, FaBuilding, FaSignInAlt, FaSignOutAlt, FaUser, FaCog, FaBookmark } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get('searchTerm');
    if (searchTermUrl) {
      setSearchTerm(searchTermUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 bg-white shadow-md ${
        isScrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-2 shadow-md">
            <FaHome className="text-white h-5 w-5" />
          </div>
          <h1 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            RentPal
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <NavLink to="/" label="Home" icon={<FaHome />} isActive={isActive('/')} />
          <NavLink to="/about" label="About" icon={<FaInfoCircle />} isActive={isActive('/about')} />
          <NavLink to="/search" label="Properties" icon={<FaBuilding />} isActive={isActive('/search')} />
        </nav>

        {/* Search & Auth */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSubmit} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search properties..."
              className="w-56 xl:w-64 px-4 py-2 pl-10 pr-4 rounded-full bg-gray-100 focus:bg-white border border-gray-200 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center focus:outline-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="User menu"
              >
                <div className="relative">
                  <img
                    src={currentUser.photoURL}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  {currentUser.isAdmin && (
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  )}
                </div>
              </button>

              {/* Dropdown menu */}
              <div
                className={`absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 origin-top-right border border-gray-100 ${
                  isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center">
                    <img
                      src={currentUser.photoURL}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md mr-3"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{currentUser.username}</p>
                      <p className="text-xs text-gray-500 mt-1">{currentUser.email}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link to="/profile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaUser className="w-5 h-5 text-blue-500 mr-3" />
                    <span>My Profile</span>
                  </Link>

                    {/* Conditional Rendering for My Bookings */}
              {!(currentUser.isAdmin || currentUser.isLandlord) && (
                <Link
                  to="/my-bookings"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <FaBookmark className="w-5 h-5 text-blue-500 mr-3" />
                  <span>My Bookings</span>
                </Link>
              )}

                  {currentUser.isAdmin && (
                    <Link to="/admin-dashboard"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaCog className="w-5 h-5 text-red-500 mr-3" />
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <FaSignOutAlt className="w-5 h-5 text-red-500 mr-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/signin"
              className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <FaSignInAlt className="mr-2" />
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            ref={menuRef}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`relative w-6 h-5 ${isMenuOpen ? 'transform' : ''}`}>
              <span className={`absolute h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`absolute h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'translate-y-2'}`}></span>
              <span className={`absolute h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white shadow-xl transition-all duration-300 ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-5">
          <nav className="flex flex-col space-y-1 mb-6">
            <MobileNavLink to="/" label="Home" icon={<FaHome />} onClick={() => setIsMenuOpen(false)} isActive={isActive('/')} />
            <MobileNavLink to="/about" label="About" icon={<FaInfoCircle />} onClick={() => setIsMenuOpen(false)} isActive={isActive('/about')} />
            <MobileNavLink to="/search" label="Properties" icon={<FaBuilding />} onClick={() => setIsMenuOpen(false)} isActive={isActive('/search')} />
          </nav>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-100 border border-gray-200 focus:bg-white focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          {!currentUser && (
            <div className="flex flex-col space-y-2">
              <Link
                to="/signin"
                className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaSignInAlt className="mr-2" />
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center bg-white text-blue-600 border border-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Desktop navigation link component
const NavLink = ({ to, label, icon, isActive }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <span className="mr-1.5">{icon}</span>
    {label}
  </Link>
);

// Mobile navigation link component
const MobileNavLink = ({ to, label, icon, onClick, isActive }) => (
  <Link
    to={to}
    className={`flex items-center p-3 rounded-xl font-medium ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
      {icon}
    </span>
    {label}
  </Link>
);

export default Header;