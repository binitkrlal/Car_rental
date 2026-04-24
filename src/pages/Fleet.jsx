import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Clock, TrendingUp } from 'lucide-react';
import { carsData } from '../data/cars';
import CarCard, { CarCardSkeleton } from '../components/CarCard';
import { useBooking } from '../context/BookingContext';
import './Fleet.css';

const Fleet = () => {
  const location = useLocation();
  const { recentSearches, addRecentSearch } = useBooking();
  const [filters, setFilters] = useState({ type: '', fuel: '', brand: [], minPrice: 0, maxPrice: 10000, seats: '', transmission: '' });
  const [sortMethod, setSortMethod] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Apply filters from hero search
  useEffect(() => {
    if (location.state) {
      const { type, location: loc, pickup, returnD } = location.state;
      if (type) {
        setFilters(prev => ({ ...prev, type }));
      }
      // Track search
      if (loc || type || pickup || returnD) {
        addRecentSearch({
          type: type || 'All',
          location: loc || '',
          date: pickup || '',
          timestamp: Date.now()
        });
      }
    }
    // Simulate loading for skeleton effect
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.state]);

  const brands = [...new Set(carsData.map(c => c.brand))];
  const types = [...new Set(carsData.map(c => c.type))];
  const fuels = [...new Set(carsData.map(c => c.fuel))];
  const transmissions = [...new Set(carsData.map(c => c.transmission))];
  const seatOptions = ['4', '5', '7+'];

  const filteredCars = useMemo(() => {
    let result = carsData.filter(car => {
      if (filters.type && car.type !== filters.type) return false;
      if (filters.fuel && car.fuel !== filters.fuel) return false;
      if (filters.brand.length > 0 && !filters.brand.includes(car.brand)) return false;
      if (car.price < filters.minPrice || car.price > filters.maxPrice) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.seats) {
        if (filters.seats === '7+' && car.seats < 7) return false;
        else if (filters.seats !== '7+' && car.seats !== parseInt(filters.seats)) return false;
      }
      return true;
    });

    if (sortMethod === 'price-low-high') result.sort((a,b) => a.price - b.price);
    else if (sortMethod === 'price-high-low') result.sort((a,b) => b.price - a.price);
    else if (sortMethod === 'rating') result.sort((a,b) => b.rating - a.rating);
    else if (sortMethod === 'popularity') result.sort((a,b) => b.reviews - a.reviews);
    
    return result;
  }, [filters, sortMethod]);

  // Best value cars = highest rating-to-price ratio
  const bestValueIds = useMemo(() => {
    const sorted = [...carsData]
      .filter(c => c.available)
      .sort((a, b) => (b.rating / b.price) - (a.rating / a.price));
    return new Set(sorted.slice(0, 3).map(c => c.id));
  }, []);

  // Recommended cars based on current filters
  const recommended = useMemo(() => {
    if (!filters.type && !filters.fuel && !filters.brand) return [];
    return carsData
      .filter(c => c.available && !filteredCars.find(fc => fc.id === c.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [filters, filteredCars]);

  const clearFilters = () => setFilters({ type: '', fuel: '', brand: [], minPrice: 0, maxPrice: 10000, seats: '', transmission: '' });
  const activeCount = [filters.type, filters.fuel, filters.seats, filters.transmission].filter(Boolean).length + filters.brand.length + (filters.maxPrice < 10000 ? 1 : 0);

  const lastSearch = recentSearches.length > 0 ? recentSearches[0] : null;

  const toggleBrand = (b) => {
    setFilters(p => ({
      ...p,
      brand: p.brand.includes(b) ? p.brand.filter(x => x !== b) : [...p.brand, b]
    }));
  };

  return (
    <motion.div className="fleet-page"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="fleet-page__hero">
        <div className="container">
          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }}>
            Our Fleet
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.8 }}>
            {carsData.length} premium vehicles ready for your next journey
          </motion.p>
        </div>
      </div>

      <div className="container fleet-page__content">
        {/* Recent search */}
        {lastSearch && (
          <motion.div className="fleet-page__recent"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Clock size={14} />
            <span>Recent search: </span>
            <strong>{lastSearch.type !== 'All' ? lastSearch.type : 'All types'}</strong>
            {lastSearch.location && <> in <strong>{lastSearch.location}</strong></>}
          </motion.div>
        )}

        {/* Mobile filter toggle */}
        <button className="fleet-page__filter-toggle btn-secondary" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={16} /> Filters {activeCount > 0 && `(${activeCount})`}
        </button>

        <div className="fleet-page__layout">
          {/* Sidebar Filters */}
          <aside className={`fleet-page__sidebar ${showFilters ? 'fleet-page__sidebar--open' : ''}`}>
            <div className="fleet-page__sidebar-header">
              <h3>Filters</h3>
              <div className="fleet-page__sidebar-actions">
                {activeCount > 0 && <button className="btn-ghost" onClick={clearFilters}><X size={14} /> Clear</button>}
                <button className="fleet-page__sidebar-close btn-ghost" onClick={() => setShowFilters(false)}><X size={18} /></button>
              </div>
            </div>

            <div className="fleet-page__filter-group">
              <label>Price Range (₹/day)</label>
              <div className="fleet-page__price-display">
                <span>₹{filters.minPrice.toLocaleString()}</span>
                <span>₹{filters.maxPrice.toLocaleString()}</span>
              </div>
              <input type="range" min="0" max="10000" step="500"
                value={filters.maxPrice}
                onChange={e => setFilters(p => ({ ...p, maxPrice: Number(e.target.value) }))}
                className="fleet-page__slider" />
            </div>

            <div className="fleet-page__filter-group">
              <label>Vehicle Type</label>
              <div className="fleet-page__chips">
                {types.map(t => (
                  <button key={t} className={`fleet-page__chip ${filters.type === t ? 'fleet-page__chip--active' : ''}`}
                    onClick={() => setFilters(p => ({ ...p, type: p.type === t ? '' : t }))}>{t}</button>
                ))}
              </div>
            </div>

            <div className="fleet-page__filter-group">
              <label>Fuel Type</label>
              <div className="fleet-page__chips">
                {fuels.map(f => (
                  <button key={f} className={`fleet-page__chip ${filters.fuel === f ? 'fleet-page__chip--active' : ''}`}
                    onClick={() => setFilters(p => ({ ...p, fuel: p.fuel === f ? '' : f }))}>{f}</button>
                ))}
              </div>
            </div>

            <div className="fleet-page__filter-group">
              <label>Transmission</label>
              <div className="fleet-page__chips">
                {transmissions.map(t => (
                  <button key={t} className={`fleet-page__chip ${filters.transmission === t ? 'fleet-page__chip--active' : ''}`}
                    onClick={() => setFilters(p => ({ ...p, transmission: p.transmission === t ? '' : t }))}>{t}</button>
                ))}
              </div>
            </div>

            <div className="fleet-page__filter-group">
              <label>Seats</label>
              <div className="fleet-page__chips">
                {seatOptions.map(s => (
                  <button key={s} className={`fleet-page__chip ${filters.seats === s ? 'fleet-page__chip--active' : ''}`}
                    onClick={() => setFilters(p => ({ ...p, seats: p.seats === s ? '' : s }))}>{s}</button>
                ))}
              </div>
            </div>

            <div className="fleet-page__filter-group">
              <label>Brand</label>
              <div className="fleet-page__chips">
                {brands.map(b => (
                  <button key={b} className={`fleet-page__chip ${filters.brand.includes(b) ? 'fleet-page__chip--active' : ''}`}
                    onClick={() => toggleBrand(b)}>{b}</button>
                ))}
              </div>
            </div>
          </aside>

          {/* Car Grid */}
          <div className="fleet-page__grid-area">
            <div className="fleet-page__grid-header">
              <p className="fleet-page__count">{filteredCars.length} vehicle{filteredCars.length !== 1 ? 's' : ''} found</p>
              
              <div className="fleet-page__sort">
                <select value={sortMethod} onChange={(e) => setSortMethod(e.target.value)} className="glass-select">
                  <option value="recommended">Recommended</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="fleet-page__grid">
                {[...Array(6)].map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : filteredCars.length > 0 ? (
              <motion.div className="fleet-page__grid" layout>
                <AnimatePresence>
                  {filteredCars.map((car, i) => (
                    <motion.div 
                      key={car.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.9 }} 
                      transition={{ duration: 0.3 }}
                    >
                      <CarCard car={car} index={i} bestValue={bestValueIds.has(car.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div className="fleet-page__empty"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="fleet-page__empty-icon">🔍</div>
                <h3>No cars available for selected filters</h3>
                <p>Try adjusting your search criteria to find the perfect ride</p>
                <button className="btn-primary" onClick={clearFilters}>Clear All Filters</button>
              </motion.div>
            )}

            {/* Recommended section */}
            {!loading && recommended.length > 0 && (
              <motion.div className="fleet-page__recommended"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <div className="fleet-page__recommended-header">
                  <TrendingUp size={18} />
                  <h3>You might also like</h3>
                </div>
                <div className="fleet-page__grid">
                  {recommended.map((car, i) => (
                    <CarCard key={car.id} car={car} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Fleet;
