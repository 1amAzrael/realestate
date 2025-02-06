import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link ,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const { currentUser } = useSelector((state) => state.user);

  const[searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);

  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get('searchTerm');
    if(searchTermUrl) {
      setSearchTerm(searchTermUrl);
    }
  }, [location.search]);


  return (
    <header className="bg-slate-200 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        {/* Left Section: Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <h1 className="font-bold text-2xl">
              <span className="text-red-600">Rent</span>
              <span className="text-blue-600">pal</span>
            </h1>
          </Link>
          
        </div>

        {/* Right Section: Search Bar & Profile/Sign In */}
        <div className="flex items-center gap-4">
        <ul className="hidden sm:flex gap-4 font-bold text-xl">
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
          <form onSubmit={handleSubmit} className="flex items-center bg-slate-100 rounded-lg p-2">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-32 sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
            <FaSearch className="text-slate-400" />

            </button>
            
          </form>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.photoURL}
                alt="profile"
                className="rounded-full w-8 h-8 object-cover"
              />
            ) : (
              <button className="inline-block rounded-xl bg-blue-900 px-8 py-3 font-medium text-white transition hover:bg-opacity-90">
                Sign In
              </button>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
