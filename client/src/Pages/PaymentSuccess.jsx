import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentDetails = location.state?.paymentDetails;

  const goToBookings = () => {
    navigate('/mybookings');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>

        {paymentDetails ? (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto text-left">
            <p className="mb-2"><strong>Amount:</strong> NPR {paymentDetails.amount}</p>
            <p className="mb-2"><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
            <p className="mb-2"><strong>Date:</strong> {paymentDetails.paymentDate}</p>
            <p className="mb-2"><strong>Payment Method:</strong> {paymentDetails.method}</p>
            <p className="mb-2"><strong>Status:</strong> {paymentDetails.status}</p>
          </div>
        ) : (
          <p className="text-gray-600 mb-6">Your payment has been successfully processed.</p>
        )}

        <p className="text-green-600 text-lg mb-8">
          Thank you for your payment! Your booking has been confirmed.
          You will receive a confirmation email shortly.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={goToBookings}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Bookings
          </button>
          <button
            onClick={goToHome}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;