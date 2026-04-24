import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/cars';
import './Testimonials.css';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(p => (p + 1) % testimonials.length);
  const t = testimonials[current];

  return (
    <section className="section test">
      <div className="container">
        <motion.div className="test__header"
          initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.8 }}>
          <h2 className="test__title">What Our Riders Say</h2>
          <p>Trusted by thousands of happy customers across India.</p>
        </motion.div>
        <div className="test__carousel">
          <button className="test__nav" onClick={prev}><ChevronLeft size={20} /></button>
          <motion.div className="test__card glass-panel"
            key={current} initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-50 }} transition={{ duration:0.5 }}>
            <Quote size={32} className="test__quote" />
            <p className="test__text">"{t.text}"</p>
            <div className="test__stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} fill={i < t.rating ? '#FFD700' : 'none'}
                  className={i < t.rating ? 'star' : 'star-empty'} />
              ))}
            </div>
            <div className="test__author">
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </div>
          </motion.div>
          <button className="test__nav" onClick={next}><ChevronRight size={20} /></button>
        </div>
        <div className="test__dots">
          {testimonials.map((_, i) => (
            <button key={i} className={`test__dot ${i === current ? 'test__dot--active' : ''}`}
              onClick={() => setCurrent(i)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
