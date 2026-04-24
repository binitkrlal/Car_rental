import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import { AnimatePresence } from 'framer-motion';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import CarDetail from './pages/CarDetail';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import BookingModal from './components/BookingModal';
import AIChatbot from './components/AIChatbot';
import MobileCTA from './components/MobileCTA';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.07, duration: 1.2, smoothWheel: true }}>
      <BookingProvider>
        <Router>
          <div className="app-wrapper">
            <Navbar />
            <main><AnimatedRoutes /></main>
            <Footer />
            <BookingModal />
            <AIChatbot />
            <MobileCTA />
          </div>
        </Router>
      </BookingProvider>
    </ReactLenis>
  );
}

export default App;
