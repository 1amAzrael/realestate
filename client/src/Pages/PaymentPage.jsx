import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  Calendar, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  ChevronLeft, 
  DollarSign,
  Truck,
  Calendar as CalendarIcon,
  Clock,
  MapPin
} from 'lucide-react';
import { initiateKhaltiPayment } from './khaltiService.js';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { worker, bookingData } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("khalti");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: bookingData?.customerName || '',
    email: '',
    phone: bookingData?.customerPhone || ''
  });

  const parseRate = (rate) => {
    if (rate === null || rate === undefined) return 0;
    if (typeof rate === 'number' && !isNaN(rate)) return rate;
    const parsedRate = parseFloat(rate);
    return isNaN(parsedRate) ? 0 : parsedRate;
  };

  useEffect(() => {
    if (!worker || !bookingData) {
      setError("Missing booking information. Please try again.");
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

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(customerInfo.phone)) {
          throw new Error('Please enter a valid 10-digit phone number');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
          throw new Error('Please enter a valid email address');
        }

        const rate = parseRate(worker?.rate);
        const finalRate = rate > 0 ? rate : 1000;

        localStorage.setItem('pending_booking', JSON.stringify({
          workerName: worker?.name || 'Unknown',
          workerId: worker?.id || 'unknown-id',
          rate: finalRate,
          date: bookingData?.shiftingDate || 'Not specified',
          address: bookingData?.shiftingAddress || 'Not specified',
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          timestamp: new Date().toISOString()
        }));

        const purchaseData = {
          name: `Booking for ${worker.name}`,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone
        };

        // Initiate payment with actual amount
        const response = await initiateKhaltiPayment(finalRate, purchaseData);

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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header with back button */}
        <div className="max-w-4xl mx-auto mb-8">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Secure your booking with a simple payment process</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <h2 className="text-xl font-bold">Payment Details</h2>
                  <p className="text-indigo-100 text-sm mt-1">All transactions are secure and encrypted</p>
                </div>
                <div className="p-6">
                  {/* Customer Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-indigo-600" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your full name"
                            required
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="email@example.com"
                            required
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="10-digit phone number"
                            required
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Format: 9XXXXXXXXX (10 digits)</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                      Payment Method
                    </h3>
                    <div className="space-y-3">
                      <label className={`
                        flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all
                        ${paymentMethod === "khalti" 
                          ? "border-indigo-500 bg-indigo-50 shadow-sm" 
                          : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/30"}
                      `}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="khalti"
                          checked={paymentMethod === "khalti"}
                          onChange={() => setPaymentMethod("khalti")}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex flex-1 justify-between items-center">
                          <span className="font-medium text-gray-900">Khalti Digital Wallet</span>
                          <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">Khalti</div>
                        </div>
                      </label>
                      
                      <label className={`
                        flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all
                        ${paymentMethod === "cash" 
                          ? "border-green-500 bg-green-50 shadow-sm" 
                          : "border-gray-300 hover:border-green-300 hover:bg-green-50/30"}
                      `}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                          className="h-5 w-5 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex flex-1 justify-between items-center">
                          <span className="font-medium text-gray-900">Cash In Hand</span>
                          <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-sm">Cash</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center mb-6">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {paymentStatus === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center mb-6">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-green-700 text-sm">Your payment was successful! Redirecting to confirmation page...</span>
                    </div>
                  )}

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={loading || paymentStatus === "success" || !worker || !bookingData}
                    className={`
                      w-full py-4 px-6 rounded-lg text-white font-medium flex items-center justify-center
                      ${loading 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : paymentStatus === "success"
                          ? "bg-green-500 cursor-not-allowed"
                          : paymentMethod === "khalti" 
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                            : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                      }
                      transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                    `}
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
                      <>
                        {paymentMethod === "khalti" ? (
                          <>
                            <img src="/khalti-logo.png" alt="Khalti" className="h-5 w-5 mr-2" />
                            Pay with Khalti
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-5 w-5 mr-2" />
                            Pay with Cash
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {/* Security Information */}
                  <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Your payment is secure and encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  {(!worker || !bookingData) ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-center">
                        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                        <p className="text-gray-600">Missing booking information.</p>
                        <button 
                          onClick={handleGoBack}
                          className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Go back and try again
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Worker Information */}
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="font-medium text-gray-800 mb-3">Service Details</h3>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {worker.name ? worker.name.charAt(0).toUpperCase() : 'W'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{worker.name || 'Worker'}</p>
                            <p className="text-sm text-gray-500">{worker.experience || 'Experienced professional'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start">
                            <Truck className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-gray-700">Human Resource Shifting</p>
                          </div>
                          <div className="flex items-start">
                            <CalendarIcon className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-gray-700">
                              <span className="font-medium">Shifting Date: </span>
                              {bookingData.shiftingDate ? new Date(bookingData.shiftingDate).toLocaleDateString() : 'Not specified'}
                            </p>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-gray-700">
                              <span className="font-medium">Address: </span>
                              {bookingData.shiftingAddress || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price Details */}
                      <div>
                        <h3 className="font-medium text-gray-800 mb-3">Payment Details</h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-gray-600">
                            <span>Service Charge</span>
                            <span>NPR {worker.rate || 1000}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>NPR 0</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <span className="font-semibold text-gray-900">Total Amount</span>
                          <span className="text-2xl font-bold text-indigo-600">
                            NPR {worker.rate || 1000}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;