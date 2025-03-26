const axios = require('axios');
const Booking = require('../models/Booking');

const initiatePayment = async (req, res) => {
  try {
    const { amount, purchaseData, bookingId } = req.body;
    
    if (!amount || !purchaseData || !bookingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', {
      return_url: `${process.env.FRONTEND_URL}/payment/verify`,
      website_url: process.env.FRONTEND_URL,
      amount: amount * 100, // Convert to paisa
      purchase_order_id: `order_${Date.now()}`,
      purchase_order_name: purchaseData.name,
      customer_info: {
        name: purchaseData.customerName,
        email: purchaseData.customerEmail,
        phone: purchaseData.customerPhone
      }
    }, {
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Update booking with payment initiation details
    await Booking.findByIdAndUpdate(bookingId, {
      payment: {
        method: 'khalti',
        status: 'initiated',
        pidx: response.data.pidx,
        amount: amount
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Payment initiation failed',
      details: error.response?.data || error.message 
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;
    
    if (!pidx) {
      return res.status(400).json({ error: 'PIDX is required' });
    }

    const response = await axios.post('https://a.khalti.com/api/v2/epayment/lookup/', {
      pidx
    }, {
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Update booking status in database
    if (response.data.status === 'Completed') {
      const booking = await Booking.findOneAndUpdate(
        { 'payment.pidx': pidx },
        { 
          'payment.status': 'completed',
          'payment.verified_at': new Date(),
          status: 'confirmed'
        },
        { new: true }
      );

      if (!booking) {
        console.warn('Booking not found for pidx:', pidx);
      }
    }

    res.json(response.data);
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Payment verification failed',
      details: error.response?.data || error.message 
    });
  }
};

module.exports = { initiatePayment, verifyPayment };