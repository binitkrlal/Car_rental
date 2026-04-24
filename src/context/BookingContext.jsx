import React, { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    step: 0, // 0=idle, 1=car selected, 2=dates, 3=details, 4=payment, 5=confirmed
    car: null,
    pickupLocation: '',
    pickupDate: '',
    returnDate: '',
    carType: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    paymentMethod: 'card',
    totalDays: 0,
    totalPrice: 0,
    basePrice: 0,
    taxAmount: 0,
    bookingId: null,
    showModal: false,
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('dr_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('dr_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const calculateDays = useCallback((pickup, returnD) => {
    if (!pickup || !returnD) return 0;
    const d1 = new Date(pickup);
    const d2 = new Date(returnD);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    // Minimum 1 day booking
    return Math.max(1, diff);
  }, []);

  const calculateTotal = useCallback((pricePerDay, days) => {
    const base = pricePerDay ? pricePerDay * days : 0;
    const tax = Math.round(base * 0.05); // 5% tax
    return { base, tax, total: base + tax };
  }, []);

  const selectCar = useCallback((car) => {
    setBooking(prev => {
      const days = calculateDays(prev.pickupDate, prev.returnDate);
      const { base, tax, total } = calculateTotal(car.price, days);
      return {
        ...prev,
        car,
        step: 1,
        showModal: true,
        totalDays: days,
        totalPrice: total,
        basePrice: base,
        taxAmount: tax,
      };
    });
  }, [calculateDays, calculateTotal]);

  const setDates = useCallback((pickupDate, returnDate) => {
    setBooking(prev => {
      const days = calculateDays(pickupDate, returnDate);
      const { base, tax, total } = calculateTotal(prev.car ? prev.car.price : 0, days);
      return {
        ...prev,
        pickupDate,
        returnDate,
        totalDays: days,
        basePrice: base,
        taxAmount: tax,
        totalPrice: total,
        step: 2
      };
    });
  }, [calculateDays, calculateTotal]);

  const setUserDetails = useCallback((name, email, phone) => {
    setBooking(prev => ({ ...prev, userName: name, userEmail: email, userPhone: phone, step: 3 }));
  }, []);

  const setPaymentMethod = useCallback((method) => {
    setBooking(prev => ({ ...prev, paymentMethod: method }));
  }, []);

  const confirmBooking = useCallback(() => {
    const id = 'DR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setBooking(prev => ({ ...prev, bookingId: id, step: 5 }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking({
      step: 0, car: null, pickupLocation: '', pickupDate: '', returnDate: '',
      carType: '', userName: '', userEmail: '', userPhone: '', paymentMethod: 'card',
      totalDays: 0, totalPrice: 0, bookingId: null, showModal: false,
    });
  }, []);

  const closeModal = useCallback(() => {
    setBooking(prev => ({ ...prev, showModal: false }));
  }, []);

  const openModal = useCallback(() => {
    setBooking(prev => ({ ...prev, showModal: true }));
  }, []);

  const updateField = useCallback((field, value) => {
    setBooking(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'pickupDate' || field === 'returnDate') {
        const pDate = field === 'pickupDate' ? value : prev.pickupDate;
        const rDate = field === 'returnDate' ? value : prev.returnDate;
        const days = calculateDays(pDate, rDate);
        const { base, tax, total } = calculateTotal(prev.car ? prev.car.price : 0, days);
        newState.totalDays = days;
        newState.basePrice = base;
        newState.taxAmount = tax;
        newState.totalPrice = total;
      }
      return newState;
    });
  }, [calculateDays, calculateTotal]);

  const toggleFavorite = useCallback((carId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(carId)) {
        next.delete(carId);
      } else {
        next.add(carId);
      }
      try { localStorage.setItem('dr_favorites', JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback((carId) => {
    return favorites.has(carId);
  }, [favorites]);

  const addRecentSearch = useCallback((searchParams) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s =>
        JSON.stringify(s) !== JSON.stringify(searchParams)
      );
      const next = [searchParams, ...filtered].slice(0, 5);
      try { localStorage.setItem('dr_recent_searches', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <BookingContext.Provider value={{
      booking, selectCar, setDates, setUserDetails, setPaymentMethod,
      confirmBooking, resetBooking, closeModal, openModal, updateField, calculateDays,
      favorites, toggleFavorite, isFavorite,
      recentSearches, addRecentSearch,
    }}>
      {children}
    </BookingContext.Provider>
  );
};
