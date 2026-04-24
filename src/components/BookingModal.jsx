import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, CreditCard, Smartphone, Building2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './BookingModal.css';

const BookingModal = () => {
  const { booking, closeModal, updateField, setUserDetails, confirmBooking, resetBooking } = useBooking();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [payProgress, setPayProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [localUser, setLocalUser] = useState({ name: '', email: '', phone: '' });

  // Reset step when modal opens with a new car
  useEffect(() => {
    if (booking.showModal && booking.car) {
      setStep(1);
      setErrors({});
      setLoading(false);
      setPayProgress(0);
      setLocalUser({ name: booking.userName || '', email: booking.userEmail || '', phone: booking.userPhone || '' });
    }
  }, [booking.showModal, booking.car?.id]);

  if (!booking.showModal || !booking.car) return null;

  const today = new Date().toISOString().split('T')[0];

  const validateDates = () => {
    const errs = {};
    if (!booking.pickupDate) errs.pickup = 'Please select a pickup date';
    if (!booking.returnDate) errs.returnD = 'Please select a return date';
    if (booking.pickupDate && booking.returnDate) {
      if (new Date(booking.returnDate) <= new Date(booking.pickupDate)) errs.returnD = 'Return date must be after pickup date';
    }
    if (booking.pickupDate && new Date(booking.pickupDate) < new Date(today)) errs.pickup = 'Pickup date cannot be in the past';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateUser = () => {
    const errs = {};
    if (!localUser.name.trim()) errs.name = 'Full name is required';
    if (!localUser.email.trim() || !/\S+@\S+\.\S+/.test(localUser.email)) errs.email = 'Please enter a valid email address';
    if (!localUser.phone.trim() || localUser.phone.replace(/\D/g, '').length < 10) errs.phone = 'Please enter a valid phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateDates()) { setStep(2); setErrors({}); }
    else if (step === 2 && validateUser()) {
      setUserDetails(localUser.name, localUser.email, localUser.phone);
      setStep(3); setErrors({});
    }
  };

  const handlePay = () => {
    setLoading(true);
    setPayProgress(0);
    // Simulate payment processing with progress
    const interval = setInterval(() => {
      setPayProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
      if (booking.paymentMethod === 'upi') {
        if (prev < 20) return 20;
        if (prev < 50) return 50;
        if (prev < 80) return 80;
      }
      return prev + 4;
    });
  }, 100);
  setTimeout(() => {
    clearInterval(interval);
    setPayProgress(100);
    confirmBooking();
    setLoading(false);
    setStep(4);
  }, booking.paymentMethod === 'upi' ? 3500 : 2800);
  };

  const handleClose = () => { closeModal(); setStep(1); setLocalUser({ name: '', email: '', phone: '' }); setErrors({}); setLoading(false); setPayProgress(0); };
  const handleDone = () => { resetBooking(); setStep(1); setLocalUser({ name: '', email: '', phone: '' }); setPayProgress(0); };

  const car = booking.car;

  const backdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
  const modal = {
    hidden: { opacity: 0, scale: 0.92, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.92, y: 40 }
  };

  const stepAnim = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <AnimatePresence>
      <motion.div className="bm-backdrop" variants={backdrop} initial="hidden" animate="visible" exit="exit" onClick={handleClose}>
        <motion.div className="bm-modal" variants={modal} onClick={e => e.stopPropagation()}>
          <button className="bm-close" onClick={handleClose}><X size={20} /></button>

          {/* Progress */}
          <div className="bm-progress">
            {['Dates', 'Details', 'Payment', 'Confirmed'].map((label, i) => (
              <div key={i} className={`bm-progress__step ${step > i + 1 ? 'bm-progress__step--done' : ''} ${step === i + 1 ? 'bm-progress__step--active' : ''}`}>
                <div className="bm-progress__dot">{step > i + 1 ? '✓' : i + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Car summary */}
          <div className="bm-car">
            <img src={car.image} alt={car.name} />
            <div>
              <h3>{car.name}</h3>
              <p>₹{car.price.toLocaleString()}/day • {car.fuel} • {car.seats} seats</p>
            </div>
          </div>

          {/* Step 1: Dates */}
          {step === 1 && (
            <motion.div className="bm-step" {...stepAnim}>
              <h4>Select Your Dates</h4>
              <div className="bm-form-row">
                <div className="bm-field">
                  <label><Calendar size={14} /> Pickup Date</label>
                  <input type="date" className="glass-input" min={today}
                    value={booking.pickupDate} onChange={e => { updateField('pickupDate', e.target.value); setErrors(prev => ({ ...prev, pickup: '' })); }} />
                  {errors.pickup && <span className="bm-err"><AlertCircle size={12} /> {errors.pickup}</span>}
                </div>
                <div className="bm-field">
                  <label><Calendar size={14} /> Return Date</label>
                  <input type="date" className="glass-input" min={booking.pickupDate || today}
                    value={booking.returnDate} onChange={e => { updateField('returnDate', e.target.value); setErrors(prev => ({ ...prev, returnD: '' })); }} />
                  {errors.returnD && <span className="bm-err"><AlertCircle size={12} /> {errors.returnD}</span>}
                </div>
              </div>
              {booking.totalDays > 0 && (
                <motion.div className="bm-summary"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <div><span>Price per day</span><strong>₹{car.price.toLocaleString()}</strong></div>
                  <div><span>Number of days</span><strong>{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</strong></div>
                  <div><span>Taxes & Fees (5%)</span><strong>₹{booking.taxAmount.toLocaleString()}</strong></div>
                  <div className="bm-summary__total"><span>Total Price</span><strong>₹{booking.totalPrice.toLocaleString()}</strong></div>
                </motion.div>
              )}
              <button className="btn-primary bm-next" onClick={nextStep} disabled={!booking.totalDays}>
                {booking.totalDays > 0 ? 'Continue' : 'Select dates to continue'}
              </button>
            </motion.div>
          )}

          {/* Step 2: User Details */}
          {step === 2 && (
            <motion.div className="bm-step" {...stepAnim}>
              <h4>Your Details</h4>
              <div className="bm-field">
                <label><User size={14} /> Full Name</label>
                <input type="text" className="glass-input" placeholder="John Doe"
                  value={localUser.name} onChange={e => { setLocalUser(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }} />
                {errors.name && <span className="bm-err"><AlertCircle size={12} /> {errors.name}</span>}
              </div>
              <div className="bm-field">
                <label><Mail size={14} /> Email</label>
                <input type="email" className="glass-input" placeholder="john@example.com"
                  value={localUser.email} onChange={e => { setLocalUser(p => ({ ...p, email: e.target.value })); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }} />
                {errors.email && <span className="bm-err"><AlertCircle size={12} /> {errors.email}</span>}
              </div>
              <div className="bm-field">
                <label><Phone size={14} /> Phone</label>
                <input type="tel" className="glass-input" placeholder="+91 98765 43210"
                  value={localUser.phone} onChange={e => { setLocalUser(p => ({ ...p, phone: e.target.value })); if (errors.phone) setErrors(prev => ({ ...prev, phone: '' })); }} />
                {errors.phone && <span className="bm-err"><AlertCircle size={12} /> {errors.phone}</span>}
              </div>
              <div className="bm-btns">
                <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button className="btn-primary bm-next" onClick={nextStep}>Continue</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div className="bm-step" {...stepAnim}>
              <h4>Payment</h4>
              <div className="bm-summary">
                <div><span>Car</span><strong>{car.name}</strong></div>
                <div><span>Price per day</span><strong>₹{car.price.toLocaleString()}</strong></div>
                <div><span>Duration</span><strong>{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</strong></div>
                <div><span>Taxes & Fees (5%)</span><strong>₹{booking.taxAmount.toLocaleString()}</strong></div>
                <div className="bm-summary__total"><span>Total Amount</span><strong>₹{booking.totalPrice.toLocaleString()}</strong></div>
              </div>
              <div className="bm-payment-methods">
                <label className={`bm-pm ${booking.paymentMethod === 'card' ? 'bm-pm--active' : ''}`}>
                  <input type="radio" name="pm" value="card" checked={booking.paymentMethod === 'card'}
                    onChange={() => updateField('paymentMethod', 'card')} />
                  <CreditCard size={20} /> Credit / Debit Card
                </label>
                <label className={`bm-pm ${booking.paymentMethod === 'upi' ? 'bm-pm--active' : ''}`}>
                  <input type="radio" name="pm" value="upi" checked={booking.paymentMethod === 'upi'}
                    onChange={() => updateField('paymentMethod', 'upi')} />
                  <Smartphone size={20} /> UPI
                </label>
                <label className={`bm-pm ${booking.paymentMethod === 'netbanking' ? 'bm-pm--active' : ''}`}>
                  <input type="radio" name="pm" value="netbanking" checked={booking.paymentMethod === 'netbanking'}
                    onChange={() => updateField('paymentMethod', 'netbanking')} />
                  <Building2 size={20} /> Net Banking
                </label>
              </div>
              {booking.paymentMethod === 'upi' && !loading && (
                <motion.div className="bm-upi-container" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <div className="bm-upi-qr">
                    <div className="bm-upi-qr-inner">
                      <Smartphone size={32} className="bm-upi-qr-icon" />
                    </div>
                  </div>
                  <div className="bm-upi-info">
                    <span>Scan to pay via any UPI app</span>
                    <strong>pay@dragonrides</strong>
                  </div>
                </motion.div>
              )}
              {loading && (
                <motion.div className="bm-processing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bm-processing__bar">
                    <motion.div className="bm-processing__fill"
                      style={{ width: `${payProgress}%` }}
                      transition={{ duration: 0.1 }} />
                  </div>
                  <p className="bm-processing__text">
                    {booking.paymentMethod === 'upi' ? (
                       payProgress < 50 ? 'Awaiting verification...' :
                       payProgress < 80 ? 'Confirming with bank...' :
                       'Payment Verified ✅'
                    ) : (
                       payProgress < 30 ? 'Connecting to payment gateway...' :
                       payProgress < 60 ? 'Verifying payment details...' :
                       payProgress < 90 ? 'Processing transaction...' :
                       'Finalizing booking...'
                    )}
                  </p>
                </motion.div>
              )}
              <div className="bm-btns">
                <button className="btn-secondary" onClick={() => setStep(2)} disabled={loading}>Back</button>
                <button className="btn-primary bm-next" onClick={handlePay} disabled={loading}>
                  {loading ? <><Loader2 size={18} className="bm-spin" /> Processing...</> :
                   (booking.paymentMethod === 'upi' ? `I Have Paid ₹${booking.totalPrice.toLocaleString()}` : `Pay ₹${booking.totalPrice.toLocaleString()}`)}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <motion.div className="bm-step bm-confirm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <motion.div className="bm-confirm__icon"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                <CheckCircle size={64} />
              </motion.div>
              <h3>Payment Successful ✅</h3>
              <p>Your ride is ready. We've sent confirmation to {booking.userEmail}</p>
              <div className="bm-confirm__details">
                <div><span>Booking ID</span><strong>{booking.bookingId}</strong></div>
                <div><span>Car</span><strong>{car.name}</strong></div>
                <div><span>Dates</span><strong>{booking.pickupDate} → {booking.returnDate}</strong></div>
                <div><span>Duration</span><strong>{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</strong></div>
                <div><span>Amount Paid</span><strong>₹{booking.totalPrice.toLocaleString()}</strong></div>
                <div><span>Payment</span><strong>{booking.paymentMethod.toUpperCase()}</strong></div>
              </div>
              <button className="btn-primary bm-next" onClick={handleDone}>Done</button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
