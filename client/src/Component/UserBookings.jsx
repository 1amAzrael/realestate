import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function UserBookings() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [filterError, setFilterError] = useState('');
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
    const baseStyle = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'approved':
        return <span className={`${baseStyle} bg-green-100 text-green-800`}>Approved</span>;
      case 'rejected':
        return <span className={`${baseStyle} bg-red-100 text-red-800`}>Rejected</span>;
      default:
        return <span className={`${baseStyle} bg-yellow-100 text-yellow-800`}>Pending</span>;
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

  const filteredBookings = bookings.filter(booking =>
    booking.listingId?.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f3f4f6] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter by property name..."
            value={filter}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filterError && <p className="text-red-500 text-sm mt-1">{filterError}</p>}
        </div>

        {filteredBookings.length === 0 ? (
          <p className="text-gray-500 text-center">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {booking.listingId?.name || 'Unknown Property'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {booking.listingId?.address || 'Unknown Address'}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      <span className="font-medium">Visit Date:</span> {new Date(booking.preferredDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Booked on:</span> {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(booking.status)}
                    {booking.status === 'approved' && (
                      <button
                        onClick={() => handleViewListing(booking.listingId._id)}
                        className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBookings;