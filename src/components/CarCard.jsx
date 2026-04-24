import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Fuel, Gauge, Star, Eye, Heart } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './CarCard.css';

const CarCardSkeleton = () => (
  <div className="car-card glass-panel car-card--skeleton">
    <div className="car-card__image-wrap skeleton-box" />
    <div className="car-card__body">
      <div className="car-card__top">
        <div>
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line skeleton-line--subtitle" />
        </div>
        <div className="skeleton-line skeleton-line--price" />
      </div>
      <div className="skeleton-line skeleton-line--rating" />
      <div className="car-card__specs">
        <div className="skeleton-line skeleton-line--spec" />
        <div className="skeleton-line skeleton-line--spec" />
        <div className="skeleton-line skeleton-line--spec" />
      </div>
      <div className="car-card__actions">
        <div className="skeleton-line skeleton-line--btn" />
        <div className="skeleton-line skeleton-line--btn-sm" />
      </div>
    </div>
  </div>
);

const CarCard = ({ car, index = 0, showSkeleton = false, bestValue = false }) => {
  const navigate = useNavigate();
  const { selectCar, toggleFavorite, isFavorite } = useBooking();
  const [imgLoaded, setImgLoaded] = useState(false);

  if (showSkeleton) return <CarCardSkeleton />;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(car.rating));
  const fav = isFavorite(car.id);
  const availableLeft = (car.id * 7) % 4 + 1;

  return (
    <motion.div
      className="car-card glass-panel"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="car-card__image-wrap" onClick={() => navigate(`/car/${car.id}`)}>
        {!imgLoaded && <div className="car-card__img-skeleton skeleton-box" />}
        <img src={car.image} alt={car.name} className={`car-card__image ${imgLoaded ? '' : 'car-card__image--loading'}`}
          loading="lazy" onLoad={() => setImgLoaded(true)} />
        <div className="car-card__overlay">
          <button className="btn-ghost"><Eye size={16} /> Quick View</button>
        </div>
        {!car.available && <div className="car-card__unavailable">Unavailable</div>}
        <div className="car-card__badge">{car.category}</div>
        {bestValue && <div className="car-card__best-value">⭐ Best Value</div>}
      </div>

      <button className={`car-card__fav ${fav ? 'car-card__fav--active' : ''}`}
        onClick={(e) => { e.stopPropagation(); toggleFavorite(car.id); }}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}>
        <Heart size={18} fill={fav ? '#DC2626' : 'none'} />
      </button>

      <div className="car-card__body">
        <div className="car-card__top">
          <div>
            <h3 className="car-card__name">{car.name}</h3>
            <span className="car-card__brand">{car.brand} • {car.type}</span>
          </div>
          <div className="car-card__price">
            <strong>₹{car.price.toLocaleString()}</strong>
            <span>/day</span>
          </div>
        </div>

        <div className="car-card__rating">
          {stars.map((filled, i) => (
            <Star key={i} size={14} className={filled ? 'star' : 'star-empty'}
              fill={filled ? '#FFD700' : 'none'} />
          ))}
          <span>{car.rating} ({car.reviews})</span>
        </div>

        <div className="car-card__specs">
          <span><Users size={14} /> {car.seats}</span>
          <span><Gauge size={14} /> {car.transmission}</span>
          <span><Fuel size={14} /> {car.fuel}</span>
        </div>

        {car.available && (
          <div className="car-card__urgency">
            ⚡ Only {availableLeft} left at this price
          </div>
        )}

        <div className="car-card__actions">
          <button className="btn-primary car-card__book"
            disabled={!car.available}
            onClick={() => { selectCar(car); }}>
            {car.available ? 'Book Now' : 'Unavailable'}
          </button>
          <button className="btn-secondary car-card__detail"
            onClick={() => navigate(`/car/${car.id}`)}>
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export { CarCardSkeleton };
export default CarCard;
