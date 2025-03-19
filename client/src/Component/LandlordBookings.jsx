import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function LandlordBookings() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/booking/landlord/${currentUser._id}`);
        const data = await res.json();
        
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        
        // Ensure bookings are set correctly
        setBookings(data.bookings || data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser._id]);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`/api/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setError(data.message);
        return;
      }
      
      // Update the bookings state
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status } : booking
      ));
      
    } catch (err) {
      setError("Failed to update booking status");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading booking requests...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Booking Requests</h2>
      
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">You don't have any booking requests yet.</p>
      ) : (
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {bookings.map((booking) => (
            <div key={booking._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="mb-4 flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    Property: {booking.listingId?.name || 'Unknown Property'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {booking.listingId?.address || 'Unknown Address'}
                  </p>
                </div>
                <div className="text-sm">
                  {booking.status === 'pending' ? (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      Pending
                    </span>
                  ) : booking.status === 'approved' ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Client Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p><span className="font-medium">Name:</span> {booking.name}</p>
                    <p><span className="font-medium">Contact:</span> {booking.contact}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Address:</span> {booking.address}</p>
                    <p>
                      <span className="font-medium">Visit Date:</span> {new Date(booking.preferredDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              {booking.status === 'pending' && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleUpdateStatus(booking._id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LandlordBookings;