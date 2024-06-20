// PremiumModal.js
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import './PremiumModal.css';

const PremiumModal = ({ open, handleClose }) => {
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
              ₹499
            </Typography>
            <ul>
              <li>Unlimited tweets</li>
              <li>Ad-free experience</li>
              <li>Priority support</li>
            </ul>
            <Button variant="contained" color="primary">
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
              <li>Ad-free experience</li>
              <li>Priority support</li>
              <li>Exclusive features</li>
            </ul>
            <Button variant="contained" color="primary">
              Subscribe
            </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default PremiumModal;
