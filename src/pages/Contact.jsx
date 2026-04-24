import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.message.trim()) errs.message = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <motion.div className="contact-page" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}>
      <div className="contact-page__hero">
        <div className="container">
          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
            Let's Get You Moving
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
            Have questions? We'd love to hear from you.
          </motion.p>
        </div>
      </div>
      <div className="container">
        <div className="contact-page__grid">
          <motion.div className="contact-page__info" initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
            <h2>Dragon Rides Pvt. Ltd.</h2>
            <div className="contact-page__info-items">
              <div className="contact-page__info-item">
                <div className="contact-page__info-icon"><MapPin size={20} /></div>
                <div>
                  <h4>Address</h4>
                  <p>Sector 62, Noida<br/>Uttar Pradesh, India</p>
                </div>
              </div>
              <div className="contact-page__info-item">
                <div className="contact-page__info-icon"><Phone size={20} /></div>
                <div>
                  <h4>Phone</h4>
                  <p><a href="tel:+919876543210">+91 98765 43210</a></p>
                </div>
              </div>
              <div className="contact-page__info-item">
                <div className="contact-page__info-icon"><Mail size={20} /></div>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:support@dragonrides.com">support@dragonrides.com</a></p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="contact-page__form-wrap glass-panel" initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.8, delay:0.2 }}>
            {submitted ? (
              <div className="contact-page__success">
                <CheckCircle size={48} />
                <h3>Message Sent!</h3>
                <p>We'll get back to you within 24 hours.</p>
                <button className="btn-primary" onClick={() => setSubmitted(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-page__form">
                <h3>Send Us a Message</h3>
                <div className="contact-page__field">
                  <label>Name</label>
                  <input type="text" className="glass-input" placeholder="Your name"
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  {errors.name && <span className="contact-page__err">{errors.name}</span>}
                </div>
                <div className="contact-page__field">
                  <label>Email</label>
                  <input type="email" className="glass-input" placeholder="Your email"
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  {errors.email && <span className="contact-page__err">{errors.email}</span>}
                </div>
                <div className="contact-page__field">
                  <label>Message</label>
                  <textarea className="glass-input" rows="5" placeholder="How can we help?"
                    value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  {errors.message && <span className="contact-page__err">{errors.message}</span>}
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} /> Start Your Journey
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
