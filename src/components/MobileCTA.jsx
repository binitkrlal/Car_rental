import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import './MobileCTA.css';

const MobileCTA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, openModal } = useBooking();

  // Don't show on home page (hero has its own CTA)
  if (location.pathname === '/') return null;

  const handleClick = () => {
    if (booking.car) {
      openModal();
    } else {
      navigate('/fleet');
    }
  };

  return (
    <div className="mobile-cta">
      <button className="btn-primary mobile-cta__btn" onClick={handleClick}>
        {booking.car ? `Book ${booking.car.name}` : 'Browse & Book Cars'}
      </button>
    </div>
  );
};

export default MobileCTA;
