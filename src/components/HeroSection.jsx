import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Search, ChevronDown } from 'lucide-react';
import { locations } from '../data/cars';
import { useBooking } from '../context/BookingContext';
import './HeroSection.css';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useTransform(scrollY, [0, 400], [0, -60]);
  const navigate = useNavigate();
  const { addRecentSearch } = useBooking();

  const [form, setForm] = useState({ location: '', pickup: '', returnD: '', type: '' });
  const [locOpen, setLocOpen] = useState(false);
  const [filtered, setFiltered] = useState(locations);
  const [error, setError] = useState('');
  const locRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (locRef.current && !locRef.current.contains(e.target)) setLocOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLocSearch = (val) => {
    setForm(p => ({ ...p, location: val }));
    setFiltered(locations.filter(l => l.toLowerCase().includes(val.toLowerCase())));
    setLocOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.pickup || !form.returnD) { setError('Please select both pickup and return dates'); return; }
    const p = new Date(form.pickup);
    const r = new Date(form.returnD);
    if (r <= p) { setError('Return date must be after pickup date'); return; }
    if (p < new Date(new Date().toDateString())) { setError('Pickup date cannot be in the past'); return; }
    // Track search
    addRecentSearch({
      type: form.type || 'All',
      location: form.location || '',
      date: form.pickup || '',
      timestamp: Date.now()
    });
    navigate('/fleet', { state: form });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="hero">
      <motion.div className="hero__bg" style={{ y: bgY }}>
        <div className="hero__particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="hero__particle" style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 5}s`
            }} />
          ))}
        </div>
      </motion.div>
      <div className="hero__overlay" />

      <div className="container hero__content">
        <motion.div className="hero__text" style={{ opacity: textOpacity, y: textY }}>
          <motion.p className="hero__tag"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >🐉 DRAGON RIDES</motion.p>

          <motion.h1 className="hero__title"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >Unleash<br/><span className="hero__title-accent">the Drive</span></motion.h1>

          <motion.p className="hero__subtitle"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >Premium car rentals powered by intelligent technology<br/>and seamless experience.</motion.p>
        </motion.div>

        <motion.form className="hero__booking glass-panel" onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__booking-grid">
            <div className="hero__field" ref={locRef}>
              <label><MapPin size={14} /> Pickup Location</label>
              <input type="text" className="glass-input" placeholder="City or Airport"
                value={form.location} onChange={e => handleLocSearch(e.target.value)}
                onFocus={() => setLocOpen(true)} />
              {locOpen && filtered.length > 0 && (
                <div className="hero__dropdown">
                  {filtered.map((l, i) => (
                    <div key={i} className="hero__dropdown-item"
                      onClick={() => { setForm(p => ({ ...p, location: l })); setLocOpen(false); }}
                    ><MapPin size={14} /> {l}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="hero__field">
              <label><Calendar size={14} /> Pickup Date</label>
              <input type="date" className="glass-input" min={today}
                value={form.pickup} onChange={e => {
                  setForm(p => ({ ...p, pickup: e.target.value }));
                  setError('');
                  // Auto-clear return date if it's now invalid
                  if (form.returnD && new Date(form.returnD) <= new Date(e.target.value)) {
                    setForm(p => ({ ...p, pickup: e.target.value, returnD: '' }));
                  }
                }} />
            </div>
            <div className="hero__field">
              <label><Calendar size={14} /> Return Date</label>
              <input type="date" className="glass-input" min={form.pickup || today}
                value={form.returnD} onChange={e => { setForm(p => ({ ...p, returnD: e.target.value })); setError(''); }} />
            </div>
            <div className="hero__field">
              <label><ChevronDown size={14} /> Car Type</label>
              <select className="glass-input" value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="">All Types</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>
          </div>
          {error && (
            <motion.p className="hero__error"
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
              {error}
            </motion.p>
          )}
          <div className="hero__actions">
            <button type="submit" className="btn-primary"><Search size={18} /> Find Cars</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/fleet')}>Explore Fleet</button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default HeroSection;
