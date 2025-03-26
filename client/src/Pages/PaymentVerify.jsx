// src/Pages/PaymentVerify.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyKhaltiPayment } from './khaltiService';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get pidx parameter from URL
        const pidx = searchParams.get('pidx');

        if (!pidx) {
          throw new Error('Payment ID not found');
        }

        console.log("Verifying payment with pidx:", pidx);

        // Verify the payment with Khalti
        const response = await verifyKhaltiPayment(pidx);

        console.log("Payment verification response:", response);

        // Get booking details from localStorage
        const pendingBooking = JSON.parse(localStorage.getItem('pending_booking') || '{}');

        // Check payment status
        if (response.status === 'Completed') {
          setPaymentStatus('success');

          // Here you would typically save the completed booking to your database
          // This is where you'd make an API call to your backend

          // Redirect to success page after a short delay
          setTimeout(() => {
            navigate('/payment/success', {
              state: {
                paymentDetails: response,
                bookingDetails: pendingBooking
              }
            });

            // Clear the pending booking from localStorage
            localStorage.removeItem('pending_booking');
          }, 2000);
        } else {
          setPaymentStatus('failed');
          setError(`Payment ${response.status}`);
        }
      } catch (error) {
        setPaymentStatus('failed');
        setError(error.message || 'Payment verification failed');
        console.error('Payment verification error:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Payment Verification
        </h1>

        {verifying && (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Verifying your payment...</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-green-700 font-medium text-center">
              Payment successful! Redirecting to confirmation page...
            </p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-700 font-medium text-center">
              Payment verification failed
            </p>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;