import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const PaymentVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Get the pidx from the URL query parameters
      const params = new URLSearchParams(location.search);
      const pidx = params.get('pidx');
      
      if (!pidx) {
        setVerificationStatus('error');
        setError('Missing payment information');
        return;
      }
      
      try {
        const res = await axios.post(
          '/api/payments/verify',
          { pidx },
          {
            headers: {
              Authorization: `Bearer ${currentUser?.access_token}`,
            },
          }
        );
        
        if (res.data.status === 'Completed') {
          setVerificationStatus('success');
          setPaymentDetails({
            amount: res.data.total_amount / 100, // Convert paisa to rupees
            transactionId: res.data.transaction_id || 'N/A',
            paymentDate: new Date().toLocaleDateString(),
            method: 'Khalti',
            status: 'completed'
          });
          
          // Redirect to success page after a short delay
          setTimeout(() => {
            navigate('/payment/success', {
              state: { 
                paymentDetails: {
                  amount: res.data.total_amount / 100,
                  transactionId: res.data.transaction_id || 'N/A',
                  paymentDate: new Date().toLocaleDateString(),
                  method: 'Khalti',
                  status: 'completed'
                }
              }
            });
          }, 3000);
        } else {
          setVerificationStatus('error');
          setError(`Payment verification failed: ${res.data.status || 'Unknown status'}`);
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setVerificationStatus('error');
        setError(err.response?.data?.error || 'Failed to verify payment');
      }
    };

    if (currentUser?._id) {
      verifyPayment();
    }
  }, [location, currentUser, navigate]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {verificationStatus === 'verifying' && (
          <>
            <div className="flex justify-center mb-6">
              <FaSpinner className="text-blue-500 text-5xl animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Verifying Payment</h2>
            <p className="text-gray-600">
              Please wait while we verify your payment with Khalti...
            </p>
          </>
        )}
        
        {verificationStatus === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              <FaCheckCircle />
            </div>
            <h2 className="text-3xl font-bold mb-4">Payment Verified!</h2>
            <p className="text-green-600 text-lg mb-4">
              Your payment has been successfully verified.
            </p>
            <p className="text-gray-600 mb-4">
              Redirecting to success page...
            </p>
          </>
        )}
        
        {verificationStatus === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              <FaExclamationTriangle />
            </div>
            <h2 className="text-3xl font-bold mb-4">Verification Failed</h2>
            <p className="text-red-600 text-lg mb-4">
              {error || 'There was a problem verifying your payment.'}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate('/mybookings')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;