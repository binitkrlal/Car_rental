import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Award } from 'lucide-react';
import './About.css';

const About = () => (
  <motion.div className="about-page" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}>
    <div className="about-page__hero">
      <div className="container">
        <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          About Dragon Rides
        </motion.h1>
        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
          Redefining premium mobility since 2024
        </motion.p>
      </div>
    </div>
    <div className="container">
      <div className="about-page__story">
        <motion.div className="about-page__text" initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
          <h2>Our Story</h2>
          <p>Dragon Rides was born from a simple belief: renting a car should feel as premium as driving one. Founded in Noida by a team of automotive enthusiasts and tech innovators, we set out to build India's most intelligent car rental platform.</p>
          <p>Today, we serve thousands of customers across 12 cities, offering a curated fleet of vehicles from economy to ultra-luxury — each maintained to the highest standards and delivered with a white-glove experience.</p>
          <p>Our AI-powered platform learns your preferences, recommends the perfect vehicle, and ensures every booking is seamless from start to finish. We're not just a rental service — we're your driving partner.</p>
        </motion.div>
        <motion.div className="about-page__stats" initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.8, delay:0.2 }}>
          <div className="about-page__stat"><strong>10,000+</strong><span>Happy Riders</span></div>
          <div className="about-page__stat"><strong>12</strong><span>Cities</span></div>
          <div className="about-page__stat"><strong>150+</strong><span>Premium Vehicles</span></div>
          <div className="about-page__stat"><strong>4.8★</strong><span>Average Rating</span></div>
        </motion.div>
      </div>

      <div className="about-page__values">
        <h2>Our Values</h2>
        <div className="about-page__values-grid">
          {[
            { icon: <Shield size={28} />, title: 'Safety First', desc: 'Every vehicle undergoes 100+ point inspections. Your safety is non-negotiable.' },
            { icon: <Target size={28} />, title: 'Precision', desc: 'From booking to return, every touchpoint is designed for perfection.' },
            { icon: <Users size={28} />, title: 'Customer Obsession', desc: 'We listen, adapt, and go beyond expectations for every single rider.' },
            { icon: <Award size={28} />, title: 'Excellence', desc: 'Only the finest vehicles. Only the best experience. No compromises.' }
          ].map((v, i) => (
            <motion.div key={i} className="about-page__value glass-panel"
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.7 }}>
              <div className="about-page__value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default About;
