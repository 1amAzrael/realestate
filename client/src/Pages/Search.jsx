import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../Component/ListingItem';
import { FaSearch } from 'react-icons/fa';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    setSidebardata((prev) => ({
      ...prev,
      [id]: id === 'searchTerm' ? value : id === 'sort_order' ? value.split('_') : checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebardata);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', listings.length);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    setShowMore(data.length >= 9);
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Search Filters</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="w-full py-3 pl-10 pr-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['all', 'rent', 'sale'].map((type) => (
                <button
                  key={type}
                  type="button"
                  id={type}
                  className={`py-2 rounded-lg text-sm font-semibold transition-colors border ${
                    sidebardata.type === type ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setSidebardata({ ...sidebardata, type })}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div> 
            <div className='w-full h-2 bg-black '>

            </div>
            <div className="grid grid-cols-1 gap-4">
              {['parking', 'furnished', 'offer'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  id={filter}
                  className={`py-2 w-[30%] rounded-lg text-sm font-semibold transition-colors border ${
                    sidebardata[filter] ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setSidebardata({ ...sidebardata, [filter]: !sidebardata[filter] })}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-indigo-700 transition">Search</button>
          </form>
        </div>

        {/* Listings */}
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Listings</h1>
          {loading ? (
            <p className="text-center text-gray-500 text-lg">Loading...</p>
          ) : listings.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No listings found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}
          {showMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={onShowMoreClick}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-indigo-700 transition"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
