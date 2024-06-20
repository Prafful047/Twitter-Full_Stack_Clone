// PremiumButton.js
import React from 'react';
import { Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import './Sidebar.css';

const PremiumButton = ({onClick}) => {
  return (
    <Button
      variant="contained"
    //   color="secondary"
      startIcon={<StarIcon />}
      className="premium-button"
      onClick={onClick}
    >
      Premium
    </Button>
  );
};

export default PremiumButton;
