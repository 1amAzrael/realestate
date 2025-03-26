import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../Component/Footer";
// Make sure the path is correct based on your file structure
import { initiateKhaltiPayment } from './khaltiService.js';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { worker, bookingData } = location.state || {}; // Retrieve worker and booking data from state

  const [paymentMethod, setPaymentMethod] = useState("khalti");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add state for customer info
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Check if worker and bookingData are available
  useEffect(() => {
    // Check if worker and bookingData are available
    if (!worker || !bookingData) {
      setError("Missing booking information. Please try again.");
    } else {
      console.log("Worker data loaded:", worker);
      console.log("Booking data loaded:", bookingData);

      // Check if rate is valid
      if (!worker.rate && worker.rate !== 0) {
        console.warn("Worker rate is undefined or null:", worker.rate);
      }
    }
  }, [worker, bookingData]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (paymentMethod === "khalti") {
      try {
        setPaymentStatus("processing");
        setLoading(true);
        setError(null);

        // Validate customer info
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
          throw new Error('Please fill all customer information fields');
        }

        // Validate phone number format (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(customerInfo.phone)) {
          throw new Error('Please enter a valid 10-digit phone number');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
          throw new Error('Please enter a valid email address');
        }

        // Save booking data to localStorage for retrieval after payment
        localStorage.setItem('pending_booking', JSON.stringify({
          workerName: worker?.name || 'Unknown',
          workerId: worker?.id || 'unknown-id',
          rate: worker?.rate || 0,
          date: bookingData?.shiftingDate || 'Not specified',
          address: bookingData?.shiftingAddress || 'Not specified',
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          timestamp: new Date().toISOString()
        }));

        // Debug worker data
        console.log("Worker data:", {
          worker,
          rate: worker?.rate,
          typeOfRate: typeof worker?.rate,
          parsedRate: parseFloat(worker?.rate || 0)
        });

        const purchaseData = {
          name: `Booking for ${worker.name}`,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone
        };

        // For debugging: manually set a test amount
        const TESTING_MODE = true; // Set to false in production

        // Make sure we have a valid numeric amount
        let rate;

        if (TESTING_MODE) {
          // Use a fixed test amount for testing (1000 NPR)
          rate = 1000;
          console.log("TESTING MODE: Using test amount of 1000 NPR");
        } else {
          rate = typeof worker?.rate === 'number' ? worker.rate :
                 typeof worker?.rate === 'string' ? parseFloat(worker.rate) : 0;
        }

        if (!rate || isNaN(rate) || rate <= 0) {
          throw new Error('Invalid payment amount. Please try again with a valid amount.');
        }

        console.log("Initiating Khalti payment for amount:", rate);

        // Get direct payment URL from our service
        const response = await initiateKhaltiPayment(rate, purchaseData);

        console.log("Payment initiation response:", response);

        // Redirect to Khalti payment page
        if (response && response.payment_url) {
          window.location.href = response.payment_url;
        } else {
          throw new Error('Invalid payment response from Khalti');
        }

      } catch (error) {
        setPaymentStatus("failed");
        setError(error.message || "Payment failed. Please try again.");
        console.error('Payment error:', error);
        setLoading(false);
      }
    } else if (paymentMethod === "cash") {
      // Cash payment logic
      setPaymentStatus("processing");
      setLoading(true);

      try {
        // Validate customer info
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
          throw new Error('Please fill all customer information fields');
        }

        // Here you would typically save the booking with cash payment method to your database
        // This is a simulation for demo purposes
        setTimeout(() => {
          setPaymentStatus("success");
          setLoading(false);

          // You might want to redirect to a success page after a few seconds
          setTimeout(() => {
            navigate('/payment/success', {
              state: {
                paymentDetails: {
                  amount: worker.rate * 100,
                  transaction_id: `CASH-${Date.now()}`,
                  created_on: new Date().toISOString(),
                  status: 'Completed',
                  payment_method: 'Cash'
                }
              }
            });
          }, 2000);
        }, 2000);
      } catch (error) {
        setPaymentStatus("failed");
        setError(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex flex-col">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">RentPal <span className="text-purple-200">Payment</span></h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-8 text-white">
            <h2 className="text-3xl font-bold">Payment Details</h2>
            <p className="mt-2 text-purple-100">Complete your booking securely</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
              {(!worker || !bookingData) ? (
                <div className="text-red-600">
                  <p>Missing booking information. Please go back and try again.</p>
                </div>
              ) : (
                <div className="space-y-2 text-gray-600">
                  <p className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">Human Resource Shifting</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Worker:</span>
                    <span className="font-medium">{worker?.name}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{bookingData?.shiftingDate}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Address:</span>
                    <span className="font-medium">{bookingData?.shiftingAddress}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Amount Due */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Amount Due</h3>
              <p className="text-4xl font-bold text-indigo-600">
                NPR {worker?.rate ? worker.rate : (1000).toLocaleString()}
                {!worker?.rate && <span className="text-sm ml-2 text-gray-500">(Test Amount)</span>}
              </p>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Customer Information</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="khalti"
                    checked={paymentMethod === "khalti"}
                    onChange={() => setPaymentMethod("khalti")}
                    className="form-radio text-indigo-600 h-5 w-5"
                  />
                  <span className="flex-grow">Khalti</span>
                  <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">Khalti</div>
                </label>
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="form-radio text-indigo-600 h-5 w-5"
                  />
                  <span className="flex-grow">Cash In Hand</span>
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-sm">Cash</div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              className={`w-full text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                loading
                  ? "bg-yellow-500 cursor-not-allowed"
                  : paymentStatus === "success"
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              }`}
              disabled={loading || paymentStatus === "success" || !worker || !bookingData}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : paymentStatus === "success" ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Payment Successful
                </>
              ) : (
                `Pay with ${paymentMethod === "khalti" ? "Khalti" : "Cash In Hand"}`
              )}
            </button>

            {/* Payment Success Message */}
            {paymentStatus === "success" && (
              <div className="p-4 bg-green-100 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">Your payment was successful. Thank you for your booking!</span>
              </div>
            )}

            {/* Security Message */}
            <div className="text-center text-sm text-gray-500 flex items-center justify-center">
              <Lock className="h-4 w-4 mr-1" />
              Your payment is secure and encrypted
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;