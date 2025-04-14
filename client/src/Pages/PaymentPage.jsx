import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  // Data from HR page (if available)
  const hrData = location.state;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);

        // Check if we have data from the HR page
        if (hrData && hrData.worker) {
          // Create a booking object from HR data
          setBooking({
            _id: 'hr-' + Date.now(), // Generate temporary ID
            totalAmount: parseFloat(hrData.worker.rate) || 500, // Use worker rate or default
            listing: {
              name: 'Shifting Service'
            },
            checkIn: hrData.bookingData?.shiftingDate || new Date().toISOString(),
            checkOut: hrData.bookingData?.shiftingDate || new Date().toISOString(),
            customerName: hrData.bookingData?.customerName || currentUser?.username,
            customerEmail: currentUser?.email,
            customerPhone: hrData.bookingData?.customerPhone || '',
            shiftingAddress: hrData.bookingData?.shiftingAddress || '',
            workerId: hrData.worker._id,
            worker: hrData.worker
          });
          setLoading(false);
        }
        // Otherwise, fetch booking if ID is provided
        else if (bookingId) {
          const response = await axios.get(`/api/booking/${bookingId}`);
          setBooking(response.data);
          setLoading(false);
        }
        // No data available
        else {
          setError('No booking information available');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch booking details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookingData();
  }, [bookingId, hrData, currentUser]);

  const initiateKhaltiPayment = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError(null);

      // Determine if this is an HR booking or a regular booking
      const isHrBooking = booking._id.toString().startsWith('hr-');

      let payloadData;
      // Use the same endpoint for both types of bookings
      const endpoint = '/api/payments/initiate';

      if (isHrBooking) {
        // For HR bookings
        payloadData = {
          amount: booking.totalAmount,
          purchaseData: {
            name: `Shifting Service - ${booking.worker.name}`,
            customerName: booking.customerName || currentUser.username,
            customerEmail: booking.customerEmail || currentUser.email,
            customerPhone: booking.customerPhone || '9800000000'
          },
          // Adding a type field to distinguish the booking type
          bookingType: 'shifting',
          bookingDetails: {
            workerId: booking.workerId,
            shiftingDate: booking.checkIn,
            shiftingAddress: booking.shiftingAddress,
            userId: currentUser._id
          }
        };
      } else {
        // For regular bookings
        payloadData = {
          amount: booking.totalAmount,
          bookingId: booking._id,
          purchaseData: {
            name: `Booking #${booking._id}`,
            customerName: booking.customerName || currentUser.username,
            customerEmail: booking.customerEmail || currentUser.email,
            customerPhone: booking.customerPhone || '9800000000'
          },
          bookingType: 'property'
        };
      }

      const response = await axios.post(endpoint, payloadData);

      if (response.data && response.data.data.payment_url) {
        // Redirect to Khalti payment page
        window.location.href = response.data.data.payment_url;
      } else {
        setPaymentError("Failed to initiate Khalti payment");
      }
    } catch (err) {
      setPaymentError(err.response?.data?.error || "Something went wrong");
      console.error(err);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="inline-block h-12 w-12 border-t-4 border-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">✗</div>
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || "No booking information available"}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if booking is already paid
  if (booking.payment && booking.payment.status === 'completed') {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4">Payment Already Completed</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto text-left">
            <p className="mb-2"><strong>Booking ID:</strong> {booking._id}</p>
            <p className="mb-2"><strong>Amount:</strong> NPR {booking.totalAmount}</p>
            <p className="mb-2"><strong>Status:</strong> {booking.status}</p>
            <p className="mb-2"><strong>Payment Method:</strong> {booking.payment.method}</p>
            {booking.payment.verified_at && (
              <p><strong>Payment Date:</strong> {new Date(booking.payment.verified_at).toLocaleString()}</p>
            )}
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/mybookings')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine if this is a shifting service or a regular booking
  const isShiftingService = booking._id.toString().startsWith('hr-') ||
                            (booking.workerId && booking.shiftingAddress);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-8 text-white">
          <h1 className="text-2xl font-bold">Complete Your Payment</h1>
          {!isShiftingService ? (
            <p>Booking ID: {booking._id}</p>
          ) : (
            <p>Shifting Service Payment</p>
          )}
        </div>

        <div className="p-8">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {isShiftingService ? 'Shifting Service Details' : 'Booking Information'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {isShiftingService ? (
                <>
                  <div>
                    <span className="text-sm text-gray-500">Service</span>
                    <p className="font-medium">Shifting Service</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Worker</span>
                    <p className="font-medium">{booking.worker?.name || 'Selected Worker'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Shifting Date</span>
                    <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <p className="font-medium text-blue-600">NPR {booking.totalAmount}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-sm text-gray-500">Property</span>
                    <p className="font-medium">{booking.listing?.name || 'Property'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Check In</span>
                    <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Check Out</span>
                    <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <p className="font-medium text-blue-600">NPR {booking.totalAmount}</p>
                  </div>
                </>
              )}
            </div>

            {isShiftingService && booking.shiftingAddress && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Shifting Address</span>
                <p className="font-medium">{booking.shiftingAddress}</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Select Payment Method</h2>
            <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="khalti"
                  name="payment_method"
                  checked={true}
                  readOnly
                  className="mr-3"
                />
                <label htmlFor="khalti" className="flex items-center cursor-pointer">
                  <span className="font-medium">Khalti</span>
                </label>
              </div>
            </div>

            <button
              onClick={initiateKhaltiPayment}
              disabled={paymentLoading}
              className={`w-full py-3 rounded-lg font-medium text-white ${
                paymentLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              } transition-all duration-300 shadow-md`}
            >
              {paymentLoading ? "Processing..." : `Pay NPR ${booking.totalAmount} with Khalti`}
            </button>

            {paymentError && (
              <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg">
                {paymentError}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500">
            <p>By proceeding with this payment, you agree to our terms and conditions.</p>
            <p className="mt-2">Need help? Contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;