import React from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Rocket } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  { icon: <Search size={32} />, title: 'Select Your Car', desc: 'Browse our premium fleet and find the perfect vehicle for your journey.' },
  { icon: <CalendarCheck size={32} />, title: 'Choose Your Dates', desc: 'Pick your travel dates with flexible options and instant availability.' },
  { icon: <Rocket size={32} />, title: 'Confirm & Drive', desc: 'Complete your booking in seconds and hit the road with confidence.' }
];

const HowItWorks = () => (
  <section className="section hiw">
    <div className="container">
      <motion.div className="hiw__header"
        initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:0.8 }}>
        <h2 className="hiw__title">How It Works</h2>
        <p>Three simple steps to your dream ride.</p>
      </motion.div>
      <div className="hiw__steps">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <motion.div className="hiw__step"
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.2, duration:0.7 }}>
              <div className="hiw__step-num">{String(i+1).padStart(2,'0')}</div>
              <div className="hiw__step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
            {i < 2 && <div className="hiw__connector"><div className="hiw__line" /></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
