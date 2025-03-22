import React from 'react';

const ShiftingBookings = ({ shiftingBookings }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Shifting Bookings</h2>
      {shiftingBookings.length === 0 ? (
        <p className="text-gray-600 text-center">No shifting bookings found.</p>
      ) : (
        <div className="space-y-4">
          {shiftingBookings.map((booking) => (
            <div
              key={booking._id}
              className="border p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{booking.serviceId.name}</p>
                  <p className="text-gray-600">{booking.bookingDate}</p>
                  <p className="text-gray-600">{booking.status}</p>
                </div>
                <button
                  onClick={() => window.location.href = `/shifting-booking/${booking._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShiftingBookings;