import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function UserBookings() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        setBookings(data.bookings || data); // Handle both data.bookings and data
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
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">My Bookings</h2>
      
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">You don't have any bookings yet.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {bookings.map((booking) => (
            <div key={booking._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBookings;