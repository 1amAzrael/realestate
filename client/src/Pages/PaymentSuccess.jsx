import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId, amount } = location.state || {};

  useEffect(() => {
    if (!transactionId) {
      navigate('/');
    }
  }, [transactionId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        {transactionId && (
          <div className="mb-4 text-left bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600"><span className="font-semibold">Transaction ID:</span> {transactionId}</p>
            {amount && <p className="text-gray-600"><span className="font-semibold">Amount:</span> NPR {amount}</p>}
          </div>
        )}
        <p className="text-gray-600 mb-6">Thank you for your payment. Your booking has been successfully processed.</p>
        <button
          onClick={() => navigate('/bookings')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View Your Bookings
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;