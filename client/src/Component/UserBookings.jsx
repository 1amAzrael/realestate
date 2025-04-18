// UserBookings.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaRegCalendarAlt, FaMapMarkerAlt, FaSearch,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaFilter,
  FaSortAmountDown, FaEye, FaArrowRight, FaInfoCircle
} from 'react-icons/fa';

function UserBookings() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [filterError, setFilterError] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/booking/user/${currentUser._id}`);
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        console.log("Bookings data:", data); // Add this line to inspect the data
        setBookings(data.bookings || data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser._id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-green-100 text-green-800 shadow-sm">
            <FaCheckCircle className="mr-1.5" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-red-100 text-red-800 shadow-sm">
            <FaTimesCircle className="mr-1.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 shadow-sm">
            <FaSpinner className="mr-1.5 animate-spin" />
            Pending
          </span>
        );
    }
  };

  const handleViewListing = (listingId) => {
    navigate(`/listing/${listingId}?booked=true`);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value.length > 20) {
      setFilterError('Filter text should not exceed 20 characters.');
    } else {
      setFilterError('');
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Filter and sort bookings
  const getFilteredAndSortedBookings = () => {
    // First filter
    let result = bookings.filter(booking =>
      booking.listingId?.name?.toLowerCase().includes(filter.toLowerCase())
    );

    // Then sort
    if (sortOrder === 'newest') {
      return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'oldest') {
      return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === 'upcoming') {
      return result.sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate));
    }

    return result;
  };

  const filteredBookings = getFilteredAndSortedBookings();

  // Group bookings by status
  const bookingsByStatus = {
    approved: filteredBookings.filter(booking => booking.status === 'approved'),
    pending: filteredBookings.filter(booking => booking.status === 'pending'),
    rejected: filteredBookings.filter(booking => booking.status === 'rejected')
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-lg text-gray-700 font-medium">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
              <FaInfoCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Bookings</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaRegCalendarAlt className="mr-3 text-blue-600" />
                My Bookings
              </h2>
              <p className="mt-2 text-gray-600">View and manage all your property bookings in one place.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center bg-blue-50 rounded-lg px-4 py-2 border border-blue-100">
                <span className="text-blue-800 font-medium mr-2">Total:</span>
                <span className="text-blue-600 font-bold">{bookings.length}</span>
              </div>
              <div className="flex items-center bg-green-50 rounded-lg px-4 py-2 border border-green-100">
                <span className="text-green-800 font-medium mr-2">Approved:</span>
                <span className="text-green-600 font-bold">{bookingsByStatus.approved.length}</span>
              </div>
              <div className="flex items-center bg-yellow-50 rounded-lg px-4 py-2 border border-yellow-100">
                <span className="text-yellow-800 font-medium mr-2">Pending:</span>
                <span className="text-yellow-600 font-bold">{bookingsByStatus.pending.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Sort Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by property name..."
                value={filter}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {filterError && <p className="text-red-500 text-sm mt-1">{filterError}</p>}
            </div>

            <div className="md:w-64">
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Sort by: Newest First</option>
                  <option value="oldest">Sort by: Oldest First</option>
                  <option value="upcoming">Sort by: Upcoming Visits</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FaSortAmountDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Display */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-blue-100 flex items-center justify-center rounded-full mb-6">
              <FaRegCalendarAlt className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Bookings Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filter
                ? "No bookings match your search criteria. Try a different filter."
                : "You haven't made any property bookings yet. Start browsing properties to book your next visit."}
            </p>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
            >
              Browse Properties
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        ) : (
          <div>
            {/* Status tabs */}
            <div className="flex mb-6 border-b border-gray-200">
              <button
                className="py-3 px-6 border-b-2 border-blue-600 text-blue-600 font-medium"
              >
                All Bookings ({filteredBookings.length})
              </button>
            </div>

            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 w-full md:w-64 h-48 bg-gray-200 relative">
                      {booking.listingId?.imageURL && booking.listingId.imageURL[0] ? (
                        <img
                          src={booking.listingId.imageURL[0]}
                          alt={booking.listingId.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                          <FaHome className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex flex-col h-full">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                            {booking.listingId?.name || 'Unknown Property'}
                          </h3>
                          <p className="flex items-center text-gray-600 text-sm mb-4">
                            <FaMapMarkerAlt className="mr-1 text-gray-400" />
                            {booking.listingId?.address || 'Unknown Address'}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="flex items-center text-sm text-blue-800">
                                <FaRegCalendarAlt className="mr-2 text-blue-500" />
                                <span className="font-medium">Visit Date:</span>
                                <span className="ml-2">{new Date(booking.preferredDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</span>
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="flex items-center text-sm text-gray-700">
                                <FaRegCalendarAlt className="mr-2 text-gray-500" />
                                <span className="font-medium">Booked on:</span>
                                <span className="ml-2">{new Date(booking.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Booking ID: </span>
                            <span className="ml-1 font-mono font-medium">{booking._id.substring(0, 8)}...</span>
                          </div>

                          {booking.status === 'approved' && (
                            <button
                              onClick={() => handleViewListing(booking.listingId._id)}
                              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
                            >
                              <FaEye className="mr-2" />
                              View Property
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status timeline */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className={`w-1/3 flex flex-col items-center ${booking.status === 'pending' || booking.status === 'approved' || booking.status === 'rejected' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
                          1
                        </div>
                        <span className="text-xs mt-1 font-medium">Booking Submitted</span>
                      </div>
                      <div className={`h-1 flex-grow ${booking.status === 'approved' || booking.status === 'rejected' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      <div className={`w-1/3 flex flex-col items-center ${booking.status === 'approved' || booking.status === 'rejected' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${booking.status === 'approved' || booking.status === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
                          2
                        </div>
                        <span className="text-xs mt-1 font-medium">User Review</span>
                      </div>
                      <div className={`h-1 flex-grow ${booking.status === 'approved' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      <div className={`w-1/3 flex flex-col items-center ${booking.status === 'approved' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${booking.status === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
                          3
                        </div>
                        <span className="text-xs mt-1 font-medium">Booking Confirmed</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default UserBookings;