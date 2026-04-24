import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { carsData } from '../data/cars';
import CarCard from './CarCard';
import './FeaturedFleet.css';

const FeaturedFleet = () => {
  const navigate = useNavigate();
  const featured = carsData.filter(c => c.featured).slice(0, 4);

  return (
    <section className="section ff" id="fleet-preview">
      <div className="container">
        <motion.div className="ff__header"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <div>
            <h2 className="ff__title">Featured Fleet</h2>
            <p>Curated selection of the world's most desired vehicles.</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/fleet')}>
            View All <ArrowRight size={16} />
          </button>
        </motion.div>
        <div className="ff__grid">
          {featured.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFleet;
