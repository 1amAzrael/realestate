import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaSpinner, 
  FaHome, FaUser, FaPhone, FaMapMarkerAlt, FaFilter,
  FaSortAmountDown, FaSearch, FaInfoCircle, FaEye, 
  FaBell, FaExclamationTriangle, FaAngleDown
} from 'react-icons/fa';

function LandlordBookings() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [processingBookingId, setProcessingBookingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch bookings on initial load
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/booking/landlord/${currentUser._id}`);
        const data = await res.json();
        
        if (data.success === false) {
          setError(data.message || "Failed to load booking requests");
          setLoading(false);
          return;
        }
        
        // Ensure bookings are set correctly
        setBookings(data.bookings || data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load booking requests");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser._id]);

  // Handle updating booking status
  const handleUpdateStatus = async (bookingId, status) => {
    try {
      setProcessingBookingId(bookingId);
      setError(null);
      
      const res = await fetch(`/api/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setError(data.message || "Failed to update booking status");
        setProcessingBookingId(null);
        return;
      }
      
      // Update the bookings state
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status } : booking
      ));
      
      setProcessingBookingId(null);
      
      // Show success message
      setSuccessMessage(
        `Booking ${status === 'approved' ? 'approved' : 'rejected'} successfully`
      );
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      setError("Failed to update booking status");
      setProcessingBookingId(null);
    }
  };

  // Filter and sort bookings based on search, status filter, and sort order
  const getFilteredAndSortedBookings = () => {
    // First filter by search term
    let filtered = bookings.filter(booking => 
      booking.listingId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then filter by status if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Then sort
    return filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOrder === 'upcoming') {
        return new Date(a.preferredDate) - new Date(b.preferredDate);
      }
      return 0;
    });
  };

  // Get filtered and sorted bookings
  const filteredBookings = getFilteredAndSortedBookings();
  
  // Count bookings by status
  const bookingCounts = {
    all: bookings.length,
    pending: bookings.filter(booking => booking.status === 'pending').length,
    approved: bookings.filter(booking => booking.status === 'approved').length,
    rejected: bookings.filter(booking => booking.status === 'rejected').length
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Handle view listing
  const handleViewListing = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-lg text-gray-700 font-medium">Loading booking requests...</p>
      </div>
    );
  }

  // Error state
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Message (Floating) */}
        {successMessage && (
          <div className="fixed top-24 right-4 z-50 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg animate-fade-in-out flex items-center">
            <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Header Section with Stats Cards */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="relative px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 20 + 5}px`,
                    height: `${Math.random() * 20 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold flex items-center mb-1">
                <FaCalendarAlt className="mr-3" />
                Booking Requests
              </h2>
              <p className="text-blue-100 mb-6">Manage property viewing and booking requests from customers</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center transform transition-transform hover:scale-105">
                  <div className="bg-yellow-500/20 rounded-full p-3 mr-4">
                    <FaSpinner className="h-6 w-6 text-yellow-100" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Pending</p>
                    <p className="text-2xl font-bold">{bookingCounts.pending}</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center transform transition-transform hover:scale-105">
                  <div className="bg-green-500/20 rounded-full p-3 mr-4">
                    <FaCheckCircle className="h-6 w-6 text-green-100" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Approved</p>
                    <p className="text-2xl font-bold">{bookingCounts.approved}</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center transform transition-transform hover:scale-105">
                  <div className="bg-red-500/20 rounded-full p-3 mr-4">
                    <FaTimesCircle className="h-6 w-6 text-red-100" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Rejected</p>
                    <p className="text-2xl font-bold">{bookingCounts.rejected}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl shadow-lg mb-8 p-5 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by property or client name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="appearance-none pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="upcoming">Upcoming Visits</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSortAmountDown className="text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaAngleDown className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex mb-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-6 py-3 flex items-center font-medium rounded-t-lg mr-2 transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-blue-700 border-t-2 border-l border-r border-blue-500'
                : 'bg-blue-50 text-gray-700 hover:bg-blue-100'
            }`}
          >
            All Requests
            <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
              {bookingCounts.all}
            </span>
          </button>
          
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-6 py-3 flex items-center font-medium rounded-t-lg mr-2 transition-colors ${
              statusFilter === 'pending'
                ? 'bg-white text-yellow-700 border-t-2 border-l border-r border-yellow-500'
                : 'bg-blue-50 text-gray-700 hover:bg-blue-100'
            }`}
          >
            <FaSpinner className={`mr-2 text-yellow-500 ${statusFilter === 'pending' ? 'animate-spin' : ''}`} />
            Pending
            <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
              {bookingCounts.pending}
            </span>
          </button>
          
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-6 py-3 flex items-center font-medium rounded-t-lg mr-2 transition-colors ${
              statusFilter === 'approved'
                ? 'bg-white text-green-700 border-t-2 border-l border-r border-green-500'
                : 'bg-blue-50 text-gray-700 hover:bg-blue-100'
            }`}
          >
            <FaCheckCircle className="mr-2 text-green-500" />
            Approved
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
              {bookingCounts.approved}
            </span>
          </button>
          
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-6 py-3 flex items-center font-medium rounded-t-lg transition-colors ${
              statusFilter === 'rejected'
                ? 'bg-white text-red-700 border-t-2 border-l border-r border-red-500'
                : 'bg-blue-50 text-gray-700 hover:bg-blue-100'
            }`}
          >
            <FaTimesCircle className="mr-2 text-red-500" />
            Rejected
            <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
              {bookingCounts.rejected}
            </span>
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Booking Requests Found</h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-4">
              {searchTerm
                ? "No booking requests match your search criteria. Try adjusting your search or filters."
                : statusFilter !== 'all'
                  ? `You don't have any ${statusFilter} booking requests at the moment.`
                  : "You haven't received any property booking requests yet."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="md:flex">
                  {/* Property Info */}
                  <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {booking.listingId?.name || 'Unknown Property'}
                    </h3>
                    
                    <p className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" />
                      {booking.listingId?.address || 'Address unavailable'}
                    </p>
                    
                    <div className="mt-auto">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        booking.listingId?.type === 'rent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {booking.listingId?.type === 'rent' ? 'For Rent' : 'For Sale'}
                      </div>
                      
                      <button
                        onClick={() => booking.listingId && handleViewListing(booking.listingId._id)}
                        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <FaEye className="mr-1" />
                        View Listing
                      </button>
                    </div>
                  </div>
                  
                  {/* Client Info and Actions */}
                  <div className="p-6 md:flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.name}</h4>
                          <p className="flex items-center text-gray-600 text-sm">
                            <FaPhone className="h-3 w-3 mr-1" />
                            {booking.contact}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center ${
                        booking.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'approved' ? (
                          <><FaCheckCircle className="mr-1" /> Approved</>
                        ) : booking.status === 'rejected' ? (
                          <><FaTimesCircle className="mr-1" /> Rejected</>
                        ) : (
                          <><FaSpinner className="mr-1 animate-spin" /> Pending</>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Preferred Visit Date</p>
                        <p className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-blue-500" />
                          <span className="font-medium text-gray-800">
                            {new Date(booking.preferredDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Client Address</p>
                        <p className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-blue-500" />
                          <span className="font-medium text-gray-800">{booking.address}</span>
                        </p>
                      </div>
                    </div>
                    
                    {booking.status === 'pending' && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'approved')}
                          disabled={processingBookingId === booking._id}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                            processingBookingId === booking._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md transform hover:-translate-y-0.5 transition-all'
                          }`}
                        >
                          {processingBookingId === booking._id ? (
                            <><FaSpinner className="animate-spin mr-2" /> Processing...</>
                          ) : (
                            <><FaCheckCircle className="mr-2" /> Approve Request</>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                          disabled={processingBookingId === booking._id}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                            processingBookingId === booking._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md transform hover:-translate-y-0.5 transition-all'
                          }`}
                        >
                          {processingBookingId === booking._id ? (
                            <><FaSpinner className="animate-spin mr-2" /> Processing...</>
                          ) : (
                            <><FaTimesCircle className="mr-2" /> Reject Request</>
                          )}
                        </button>
                      </div>
                    )}
                    
                    {(booking.status === 'approved' || booking.status === 'rejected') && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                        <p className="text-gray-500 text-sm">
                          This booking was {booking.status} on {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString()}.
                          {booking.status === 'approved' && ' The client has been notified and can proceed with the viewing.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default LandlordBookings;