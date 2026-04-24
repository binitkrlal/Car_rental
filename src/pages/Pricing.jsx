import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import './Pricing.css';

const plans = [
  {
    name: 'Starter', price: '₹1,999', period: '/month', desc: 'Perfect for occasional rentals',
    features: ['Up to 3 bookings/month', 'Standard fleet access', 'Email support', 'Basic insurance', 'Free cancellation (48h)'],
    highlight: false
  },
  {
    name: 'Plus', price: '₹4,999', period: '/month', desc: 'Most popular for regular drivers',
    features: ['Unlimited bookings', 'Full fleet access', 'Priority support 24/7', 'Premium insurance', 'Free cancellation (24h)', 'Airport delivery', '10% off all rentals'],
    highlight: true
  },
  {
    name: 'Elite', price: '₹9,999', period: '/month', desc: 'For the ultimate driving experience',
    features: ['Unlimited bookings', 'Luxury fleet exclusive', 'Dedicated concierge', 'Full coverage insurance', 'Instant cancellation', 'Door-to-door delivery', '25% off all rentals', 'Partner lounge access'],
    highlight: false
  }
];

const Pricing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/fleet');
  };

  return (
    <motion.div className="pricing-page" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}>
      <div className="pricing-page__hero">
        <div className="container">
          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
            Membership Plans
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
            Choose the plan that fits your lifestyle. Upgrade or cancel anytime.
          </motion.p>
        </div>
      </div>
      <div className="container">
        <div className="pricing-page__grid">
          {plans.map((plan, i) => (
            <motion.div key={i}
              className={`pricing-page__card glass-panel ${plan.highlight ? 'pricing-page__card--highlight' : ''}`}
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.15, duration:0.7 }}>
              {plan.highlight && <div className="pricing-page__popular"><Sparkles size={14} /> Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="pricing-page__price">
                <strong>{plan.price}</strong><span>{plan.period}</span>
              </div>
              <p className="pricing-page__desc">{plan.desc}</p>
              <ul className="pricing-page__features">
                {plan.features.map((f,j) => <li key={j}><Check size={16} /> {f}</li>)}
              </ul>
              <button
                className={plan.highlight ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleGetStarted}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Pricing;
