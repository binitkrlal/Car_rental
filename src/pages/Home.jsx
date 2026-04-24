import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import FeaturedFleet from '../components/FeaturedFleet';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const Home = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <HeroSection />
    <FeaturedFleet />
    <WhyChooseUs />
    <HowItWorks />
    <Testimonials />
    <BlogSection />
  </motion.div>
);

export default Home;
