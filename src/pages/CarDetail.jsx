import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Fuel, Gauge, Shield, Calendar, ChevronLeft, Check, Heart, AlertCircle } from 'lucide-react';
import { carsData } from '../data/cars';
import { useBooking } from '../context/BookingContext';
import './CarDetail.css';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectCar, updateField, booking, calculateDays, toggleFavorite, isFavorite } = useBooking();
  const car = carsData.find(c => c.id === Number(id));

  const [pickupDate, setPickupDate] = useState(booking.pickupDate || '');
  const [returnDate, setReturnDate] = useState(booking.returnDate || '');
  const [dateError, setDateError] = useState('');

  if (!car) return (
    <div className="cd-notfound">
      <div className="cd-notfound__icon">🚗</div>
      <h2>Car not found</h2>
      <p>The vehicle you're looking for doesn't exist or has been removed.</p>
      <button className="btn-primary" onClick={() => navigate('/fleet')}>Back to Fleet</button>
    </div>
  );

  const today = new Date().toISOString().split('T')[0];
  const days = calculateDays(pickupDate, returnDate);
  const total = days * car.price;
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(car.rating));
  const fav = isFavorite(car.id);

  const handlePickupChange = (val) => {
    setPickupDate(val);
    setDateError('');
    if (returnDate && new Date(returnDate) <= new Date(val)) {
      setReturnDate('');
      setDateError('Return date was reset — please re-select');
    }
  };

  const handleReturnChange = (val) => {
    setReturnDate(val);
    setDateError('');
    if (pickupDate && new Date(val) <= new Date(pickupDate)) {
      setDateError('Return date must be after pickup date');
      return;
    }
  };

  const handleReserve = () => {
    setDateError('');
    if (!pickupDate || !returnDate) {
      setDateError('Please select both pickup and return dates');
      return;
    }
    if (new Date(returnDate) <= new Date(pickupDate)) {
      setDateError('Return date must be after pickup date');
      return;
    }
    updateField('pickupDate', pickupDate);
    updateField('returnDate', returnDate);
    selectCar(car);
  };

  return (
    <motion.div className="cd" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}>
      <div className="container">
        <button className="cd__back btn-ghost" onClick={() => navigate('/fleet')}>
          <ChevronLeft size={16} /> Back to Fleet
        </button>

        <div className="cd__layout">
          {/* Left: Image */}
          <motion.div className="cd__image-area"
            initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2, duration:0.8 }}>
            <div className="cd__main-image">
              <img src={car.image} alt={car.name} />
              <div className="cd__badge">{car.category}</div>
              <button className={`cd__fav ${fav ? 'cd__fav--active' : ''}`}
                onClick={() => toggleFavorite(car.id)}
                aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}>
                <Heart size={22} fill={fav ? '#DC2626' : 'none'} />
              </button>
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div className="cd__details"
            initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3, duration:0.8 }}>
            <div className="cd__header">
              <div>
                <h1 className="cd__name">{car.name}</h1>
                <span className="cd__brand">{car.brand} • {car.type}</span>
              </div>
              <div className="cd__price-tag">
                <strong>₹{car.price.toLocaleString()}</strong><span>/day</span>
              </div>
            </div>

            <div className="cd__rating">
              {stars.map((f,i) => <Star key={i} size={16} fill={f ? '#FFD700' : 'none'} className={f ? 'star' : 'star-empty'} />)}
              <span>{car.rating} ({car.reviews} reviews)</span>
            </div>

            <p className="cd__desc">{car.description}</p>

            <div className="cd__specs-grid">
              <div className="cd__spec"><Users size={18} /><span>{car.seats} Seats</span></div>
              <div className="cd__spec"><Gauge size={18} /><span>{car.transmission}</span></div>
              <div className="cd__spec"><Fuel size={18} /><span>{car.fuel}</span></div>
              <div className="cd__spec"><Shield size={18} /><span>{car.available ? 'Available' : 'Unavailable'}</span></div>
            </div>

            {car.specs && (
              <div className="cd__perf">
                {Object.entries(car.specs).map(([k,v]) => (
                  <div key={k} className="cd__perf-item">
                    <span className="cd__perf-label">{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="cd__features">
              <h3>Features</h3>
              <div className="cd__features-grid">
                {car.features.map((f,i) => (
                  <div key={i} className="cd__feature"><Check size={14} /> {f}</div>
                ))}
              </div>
            </div>

            {/* Booking Module */}
            <div className="cd__booking glass-panel">
              <h3>Reserve This Car</h3>
              <div className="cd__booking-dates">
                <div className="cd__booking-field">
                  <label><Calendar size={14} /> Pickup</label>
                  <input type="date" className="glass-input" min={today}
                    value={pickupDate} onChange={e => handlePickupChange(e.target.value)} />
                </div>
                <div className="cd__booking-field">
                  <label><Calendar size={14} /> Return</label>
                  <input type="date" className="glass-input" min={pickupDate || today}
                    value={returnDate} onChange={e => handleReturnChange(e.target.value)} />
                </div>
              </div>
              {dateError && (
                <motion.p className="cd__booking-error"
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                  <AlertCircle size={14} /> {dateError}
                </motion.p>
              )}
              {days > 0 && !dateError && (
                <motion.div className="cd__booking-summary"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <div><span>₹{car.price.toLocaleString()} × {days} day{days>1?'s':''}</span><strong>₹{total.toLocaleString()}</strong></div>
                </motion.div>
              )}
              <button className="btn-primary cd__reserve" onClick={handleReserve} disabled={!car.available}>
                {car.available ? 'Reserve Now' : 'Currently Unavailable'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarDetail;
