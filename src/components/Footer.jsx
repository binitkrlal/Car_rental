import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Share2, Play, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer__grid">
        <div className="footer__brand">
          <h3><span>🐉</span> DRAGON<span className="footer__accent">RIDES</span></h3>
          <p>Premium car rentals powered by intelligent technology. Your journey begins here.</p>
          <div className="footer__socials">
            <a href="#" aria-label="Social"><Globe size={18} /></a>
            <a href="#" aria-label="Social"><MessageCircle size={18} /></a>
            <a href="#" aria-label="Social"><Share2 size={18} /></a>
            <a href="#" aria-label="Social"><Play size={18} /></a>
          </div>
        </div>
        <div className="footer__col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/fleet">Fleet</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer__col">
          <h4>Vehicle Types</h4>
          <Link to="/fleet">Electric</Link>
          <Link to="/fleet">Luxury Sedans</Link>
          <Link to="/fleet">SUVs</Link>
          <Link to="/fleet">Compact Cars</Link>
          <Link to="/fleet">Adventure</Link>
        </div>
        <div className="footer__col">
          <h4>Contact Us</h4>
          <a href="tel:+919876543210"><Phone size={14} /> +91 98765 43210</a>
          <a href="mailto:support@dragonrides.com"><Mail size={14} /> support@dragonrides.com</a>
          <span><MapPin size={14} /> Sector 62, Noida, UP, India</span>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2026 Dragon Rides Pvt. Ltd. All rights reserved.</p>
        <div className="footer__legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
