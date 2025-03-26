import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyKhaltiPayment } from '../Pages/khaltiService';

const PaymentVerify = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const pidx = queryParams.get('pidx');
      const transactionId = queryParams.get('transaction_id');
      const initialStatus = queryParams.get('status');
  
      const verifyPayment = async () => {
        try {
          if (!pidx) {
            throw new Error('Payment reference missing');
          }
  
          const result = await verifyKhaltiPayment(pidx);
          
          if (result.status === 'Completed') {
            setStatus('success');
            // Redirect to success page after 3 seconds
            setTimeout(() => {
              navigate('/payment/success', {
                state: {
                  transactionId,
                  amount: result.amount / 100 // Convert back to NPR
                }
              });
            }, 3000);
          } else {
            setStatus(initialStatus || result.status);
          }
        } catch (err) {
          setError(err.message);
          setStatus('failed');
        }
      };
  
      verifyPayment();
    }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {status === 'verifying' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for your payment. Your booking is confirmed.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        )}

        {status === 'User canceled' && (
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Canceled</h2>
            <p className="text-gray-600 mb-6">You canceled the payment process.</p>
            <button
              onClick={() => navigate('/payment')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;