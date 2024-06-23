import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import './PremiumModal.css';

const stripePromise = loadStripe('pk_test_51PR7PaABUckyKyxTy85soV4fuya7fb7hXjdI2AEb2cjzbdoHSMoqYUMsmmX5NmyifdXWY2oEbfdiCY8E76esWvVh00NS7SADFt');

const PremiumModal = ({ open, handleClose, userEmail }) => {
  const handlePlanSelection = async (priceId) => {
    try {
      const stripe = await stripePromise;

      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, email: userEmail }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="premium-modal-title"
      aria-describedby="premium-modal-description"
    >
      <Box className="premium-modal">
        <Typography id="premium-modal-title" variant="h4" component="h2">
          Premium
        </Typography>
        <Typography id="premium-modal-description" sx={{ mt: 2 }}>
          Get started with a Twitter premium that works for you.
        </Typography>
        <div className="plans">
          <Box className="plan">
            <Typography variant="h5" component="h3">
              Monthly Plan
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Billed monthly
            </Typography>
            <Typography variant="h6" color="primary" className="plan-price">
              ₹149
            </Typography>
            <ul>
              <li>Unlimited tweets</li>
              <li>Priority support</li>
            </ul>
            <Button variant="contained" color="primary" onClick={() => handlePlanSelection('price_1PRqIKABUckyKyxTHKeA2luK')}>
              Subscribe
            </Button>
          </Box>
          <Box className="plan">
            <Typography variant="h5" component="h3">
              Yearly Plan
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Billed yearly
            </Typography>
            <Typography variant="h6" color="primary" className="plan-price">
              ₹499
            </Typography>
            <ul>
              <li>Unlimited tweets</li>
              <li>Priority support</li>
              <li>Exclusive features</li>
            </ul>
            <Button variant="contained" color="primary" onClick={() => handlePlanSelection('price_1PRqJoABUckyKyxTeC3hyqAs')}>
              Subscribe
            </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default PremiumModal;
