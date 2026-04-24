import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, CheckCircle, Clock } from 'lucide-react';
import './WhyChooseUs.css';

const features = [
  { icon: <BrainCircuit size={28} />, title: 'AI-Powered Picks', desc: 'Smart algorithms match you with the perfect vehicle based on your preferences and journey type.' },
  { icon: <Zap size={28} />, title: 'Instant Booking', desc: 'No paperwork. No waiting. Reserve your dream car in under 60 seconds with zero friction.' },
  { icon: <CheckCircle size={28} />, title: 'Flexible Rentals', desc: 'Daily, weekly, or monthly plans. Free cancellation up to 24 hours before pickup.' },
  { icon: <Clock size={28} />, title: '24/7 Concierge', desc: 'Premium assistance anytime, anywhere. Roadside support, vehicle swap, and more.' }
];

const WhyChooseUs = () => (
  <section className="section wcu">
    <div className="container">
      <motion.div className="wcu__header"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <h2 className="wcu__title">Why Dragon Rides</h2>
        <p>Experience the new standard in premium car rentals.</p>
      </motion.div>
      <div className="wcu__grid">
        {features.map((f, i) => (
          <motion.div key={i} className="wcu__card glass-panel"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22,1,0.36,1] }}>
            <div className="wcu__icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
