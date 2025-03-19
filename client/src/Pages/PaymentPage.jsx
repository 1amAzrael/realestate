import React, { useState } from "react";
import { CreditCard, Calendar, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Footer } from "../Component/Footer";



const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("khalti");
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePayment = (e) => {
    e.preventDefault();
    // Simulating payment processing
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2000);
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
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex justify-between"><span>Service:</span> <span className="font-medium">Human Resource Shifting</span></p>
                <p className="flex justify-between"><span>Worker:</span> <span className="font-medium">John Doe</span></p>
                <p className="flex justify-between"><span>Date:</span> <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Amount Due</h3>
              <p className="text-4xl font-bold text-indigo-600">NPR 2,000</p>
            </div>

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
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="form-radio text-indigo-600 h-5 w-5"
                  />
                  <span className="flex-grow">Credit/Debit Card</span>
                  <div className="flex space-x-2">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">Visa</div>
                    <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">MC</div>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === "card" && (
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="cardNumber"
                      id="cardNumber"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="1234 5678 9012 3456"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-xs font-bold">Card</div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="expDate"
                        id="expDate"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="MM / YY"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="cvv"
                        id="cvv"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            <button
              onClick={handlePayment}
              className={`w-full text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                paymentStatus === "processing" 
                  ? "bg-yellow-500 cursor-not-allowed" 
                  : paymentStatus === "success"
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              }`}
              disabled={paymentStatus === "processing" || paymentStatus === "success"}
            >
              {paymentStatus === "processing" ? (
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
                `Pay with ${paymentMethod === "khalti" ? "Khalti" : "Card"}`
              )}
            </button>

            {paymentStatus === "success" && (
              <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">Your payment was successful. Thank you for your booking!</span>
              </div>
            )}

            <div className="text-center text-sm text-gray-500 flex items-center justify-center">
              <Lock className="h-4 w-4 mr-1" />
              Your payment is secure and encrypted
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default PaymentPage;