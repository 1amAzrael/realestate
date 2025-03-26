// src/Pages/PaymentSuccess.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronLeft, Calendar, User, MapPin } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentDetails, bookingDetails } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex flex-col">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">RentPal <span className="text-purple-200">Payment</span></h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white">
            <div className="flex items-center">
              <CheckCircle className="h-10 w-10 mr-3" />
              <h2 className="text-3xl font-bold">Payment Successful!</h2>
            </div>
            <p className="mt-2 text-green-100">Your booking has been confirmed</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center justify-center">
              <div className="bg-green-100 text-green-700 p-4 rounded-full">
                <CheckCircle className="h-16 w-16" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">Thank You For Your Payment</h3>
              <p className="text-gray-600 mt-2">
                Your transaction has been completed successfully.
              </p>
            </div>

            {/* Transaction Details */}
            {/* Transaction Details */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction Details</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-medium">{paymentDetails?.transaction_id || paymentDetails?.pidx || 'N/A'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">NPR {paymentDetails ? (paymentDetails.amount / 100).toFixed(2) : bookingDetails?.rate || 'N/A'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">Completed</span>
                </p>
                <p className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{paymentDetails?.created_on ? new Date(paymentDetails.created_on).toLocaleString() : new Date().toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Booking Details */}
            {bookingDetails && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>
                <div className="space-y-3 text-gray-600">
                  <p className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">Human Resource Shifting</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Worker:</span>
                    <span className="font-medium">{bookingDetails.workerName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{bookingDetails.date}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Address:</span>
                    <span className="font-medium">{bookingDetails.address}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Calendar className="h-5 w-5 mr-2" />
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;