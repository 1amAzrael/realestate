export const initiateKhaltiPayment = async (amount, purchaseData) => {
    try {
      // Call your backend API instead of directly calling Khalti
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount,
          purchaseData
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment initiation failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Khalti payment initiation error:', error);
      throw error;
    }
  };
  
  export const verifyKhaltiPayment = async (pidx) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ pidx })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Khalti payment verification error:', error);
      throw error;
    }
  };