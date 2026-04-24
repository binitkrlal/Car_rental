import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Mic } from 'lucide-react';
import { carsData } from '../data/cars';
import './AIChatbot.css';

const SAMPLE_QUESTIONS = [
  "Best car under ₹4000?",
  "Electric vs petrol?",
  "Which car for long trips?",
  "Best car for 5 people?",
  "Most affordable car?",
];

function getAIResponse(input) {
  const q = input.toLowerCase().trim();
  const cars = carsData;

  // Helper to format car info
  const fmtCar = (c) => `**${c.name}** — ₹${c.price.toLocaleString()}/day | ${c.fuel} | ${c.seats} seats | ⭐ ${c.rating}`;

  // --- Budget / Price queries ---
  const priceMatch = q.match(/under\s*₹?\s*(\d[\d,]*)/i) || q.match(/below\s*₹?\s*(\d[\d,]*)/i) || q.match(/less\s*than\s*₹?\s*(\d[\d,]*)/i);
  if (priceMatch) {
    const budget = parseInt(priceMatch[1].replace(/,/g, ''));
    const matches = cars.filter(c => c.price <= budget && c.available).sort((a, b) => b.rating - a.rating);
    if (matches.length === 0) {
      return `I couldn't find any cars under ₹${budget.toLocaleString()}/day. Our most affordable option is the **${cars.sort((a,b) => a.price - b.price)[0].name}** at ₹${cars.sort((a,b) => a.price - b.price)[0].price.toLocaleString()}/day.`;
    }
    let response = `Great question! Here are the best cars under ₹${budget.toLocaleString()}/day:\n\n`;
    response += `**Step 1:** Let's filter by your budget...\n`;
    response += `Found **${matches.length}** options!\n\n`;
    response += `**Step 2:** Ranked by rating:\n\n`;
    matches.slice(0, 3).forEach((c, i) => { response += `${i + 1}. ${fmtCar(c)}\n`; });
    response += `\n**Step 3:** My recommendation → **${matches[0].name}** — best rated in your budget! 🔥`;
    return response;
  }

  // --- Most affordable ---
  if (q.includes('cheapest') || q.includes('affordable') || q.includes('budget') || q.includes('lowest price')) {
    const sorted = [...cars].filter(c => c.available).sort((a, b) => a.price - b.price);
    let response = `Looking for the most budget-friendly option? Let me help!\n\n`;
    response += `**Step 1:** Sorting all cars by price (lowest first)...\n\n`;
    response += `**Top 3 most affordable:**\n\n`;
    sorted.slice(0, 3).forEach((c, i) => { response += `${i + 1}. ${fmtCar(c)}\n`; });
    response += `\n**My pick:** ${sorted[0].name} at just ₹${sorted[0].price.toLocaleString()}/day — incredible value! 💰`;
    return response;
  }

  // --- Seats / People queries ---
  const seatMatch = q.match(/(\d+)\s*(?:people|person|passengers?|seats?|seater)/i);
  if (seatMatch || q.includes('family') || q.includes('group')) {
    const needed = seatMatch ? parseInt(seatMatch[1]) : 7;
    const matches = cars.filter(c => c.seats >= needed && c.available).sort((a, b) => b.rating - a.rating);
    if (matches.length === 0) {
      return `Hmm, I couldn't find cars with ${needed}+ seats. Our largest option seats ${Math.max(...cars.map(c => c.seats))} people. Want me to show those?`;
    }
    let response = `Need space for **${needed} people**? Here's my analysis:\n\n`;
    response += `**Step 1:** Checking seat capacity across our fleet...\n`;
    response += `Found **${matches.length}** cars with ${needed}+ seats!\n\n`;
    response += `**Step 2:** Best options by rating:\n\n`;
    matches.slice(0, 3).forEach((c, i) => { response += `${i + 1}. ${fmtCar(c)}\n`; });
    response += `\n**Step 3:** Best pick → **${matches[0].name}** — rated ${matches[0].rating}⭐ with ${matches[0].seats} seats! 🎯`;
    return response;
  }

  // --- Electric vs Petrol ---
  if ((q.includes('electric') && q.includes('petrol')) || (q.includes('ev') && q.includes('fuel')) || q.includes('electric vs')) {
    const electric = cars.filter(c => c.fuel === 'Electric');
    const petrol = cars.filter(c => c.fuel === 'Petrol');
    let response = `Great comparison! Let me break it down step by step:\n\n`;
    response += `**⚡ Electric Cars:**\n`;
    electric.forEach(c => { response += `• ${fmtCar(c)}\n`; });
    response += `\n**⛽ Petrol Cars:**\n`;
    petrol.slice(0, 3).forEach(c => { response += `• ${fmtCar(c)}\n`; });
    response += `\n**Step-by-step analysis:**\n`;
    response += `1. **Cost:** Electric cars save ~40% on fuel costs\n`;
    response += `2. **Range:** Petrol has more refueling stations\n`;
    response += `3. **Experience:** Electric = silent & smooth; Petrol = traditional power\n`;
    response += `4. **Environment:** Electric = zero emissions 🌱\n\n`;
    response += `**My verdict:** For city driving → **Electric**. For long highway trips → **Petrol** is more practical 🚗`;
    return response;
  }

  // --- Electric only ---
  if (q.includes('electric') || q.includes('ev') || q.includes('tesla')) {
    const electric = cars.filter(c => c.fuel === 'Electric' && c.available);
    if (electric.length === 0) return "We don't have electric cars available right now, but check back soon!";
    let response = `Our electric fleet is amazing! Here's what we have:\n\n`;
    electric.forEach((c, i) => { response += `${i + 1}. ${fmtCar(c)}\n`; });
    response += `\n**Why go electric?**\n• Zero emissions 🌱\n• Silent & smooth driving\n• Cutting-edge tech & autopilot\n• Lower running costs`;
    return response;
  }

  // --- Long trips ---
  if (q.includes('long trip') || q.includes('long drive') || q.includes('road trip') || q.includes('highway') || q.includes('long distance')) {
    const longTrip = cars.filter(c => c.available && (c.type === 'SUV' || c.fuel === 'Diesel')).sort((a, b) => b.rating - a.rating);
    let response = `Planning a road trip? Here's my step-by-step recommendation:\n\n`;
    response += `**Step 1:** For long trips, SUVs and diesel cars are ideal — better comfort and mileage.\n\n`;
    response += `**Step 2:** Top picks from our fleet:\n\n`;
    longTrip.slice(0, 3).forEach((c, i) => { response += `${i + 1}. ${fmtCar(c)}\n`; });
    response += `\n**Step 3:** My top pick → **${longTrip[0].name}** — ${longTrip[0].description.split('.')[0]}.\n\n`;
    response += `**Pro tips for long trips:**\n• Book at least 2-3 days for value\n• Choose automatic transmission for comfort\n• Check for GPS and cruise control features 🗺️`;
    return response;
  }

  // --- SUV ---
  if (q.includes('suv')) {
    const suvs = cars.filter(c => c.type === 'SUV' && c.available).sort((a, b) => b.rating - a.rating);
    let response = `Our SUV collection — perfect for adventure and comfort!\n\n`;
    suvs.forEach((c, i) => { response += `${i + 1}. ${fmtCar(c)}\n`; });
    response += `\n**Best overall SUV:** ${suvs[0].name} (⭐ ${suvs[0].rating})`;
    return response;
  }

  // --- Luxury ---
  if (q.includes('luxury') || q.includes('premium') || q.includes('best car') || q.includes('top car')) {
    const luxury = cars.filter(c => c.available).sort((a, b) => b.rating - a.rating);
    let response = `Looking for the best? Here are our highest-rated cars:\n\n`;
    luxury.slice(0, 3).forEach((c, i) => { response += `${i + 1}. ${fmtCar(c)}\n`; });
    response += `\n**The absolute best:** ${luxury[0].name} — ⭐ ${luxury[0].rating} from ${luxury[0].reviews} reviews! 👑`;
    return response;
  }

  // --- How to book ---
  if (q.includes('how to book') || q.includes('booking') || q.includes('how do i') || q.includes('how can i')) {
    return `Here's how to book a car on Dragon Rides — super easy!\n\n**Step 1️⃣ Choose a Car**\nBrowse our fleet and find the perfect vehicle.\n\n**Step 2️⃣ Select Dates**\nPick your pickup and return dates. Price per day × days = total.\n\n**Step 3️⃣ Enter Details**\nFill in your name, email, and phone number.\n\n**Step 4️⃣ Pay & Confirm**\nChoose your payment method (Card/UPI/NetBanking) and confirm!\n\n**Step 5️⃣ You're Done! ✅**\nYou'll get a booking ID and confirmation email.\n\n💡 **Tip:** Use the "Book Now" button on any car card to start!`;
  }

  // --- Pricing explanation ---
  if (q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('pricing') || q.includes('rate')) {
    const sorted = [...cars].sort((a, b) => a.price - b.price);
    let response = `Here's our pricing breakdown:\n\n`;
    response += `**How it works:**\nTotal Price = Price per Day × Number of Days\n\n`;
    response += `**Price range:**\n`;
    response += `• Lowest: ₹${sorted[0].price.toLocaleString()}/day (${sorted[0].name})\n`;
    response += `• Highest: ₹${sorted[sorted.length-1].price.toLocaleString()}/day (${sorted[sorted.length-1].name})\n\n`;
    response += `**Categories:**\n`;
    response += `• Economy: ₹2,000 - ₹3,500/day\n`;
    response += `• Premium: ₹3,500 - ₹6,000/day\n`;
    response += `• Luxury: ₹6,000+/day\n\n`;
    response += `💡 **Tip:** Longer bookings = better daily value!`;
    return response;
  }

  // --- Greeting ---
  if (q.match(/^(hi|hello|hey|namaste|sup|yo)/)) {
    return `Hey there! 🐉 Welcome to Dragon Rides!\n\nI'm your smart assistant — here's what I can help with:\n\n• 🚗 Finding the perfect car\n• 💰 Pricing & budget recommendations\n• 📅 Booking guidance\n• ⚡ Electric vs Petrol comparison\n• 🗺️ Best cars for road trips\n\nJust ask away!`;
  }

  // --- Thanks ---
  if (q.match(/thank|thanks|thx|ty/)) {
    return `You're welcome! 🐉 Glad I could help. If you need anything else about cars, pricing, or booking — just ask! Happy driving! 🚗✨`;
  }

  // --- Fallback ---
  return `I'm not sure I understood that, but here's what I can help with:\n\n• **"Best car under ₹4000?"** — Budget recommendations\n• **"Which car for 5 people?"** — Seat-based search\n• **"Electric vs petrol?"** — Fuel comparison\n• **"How to book?"** — Booking guide\n• **"Best car for long trips?"** — Road trip picks\n\nTry one of these or ask about any specific car! 🐉`;
}

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: "Hey! 🐉 I'm Dragon AI — your smart car rental assistant. Ask me anything about cars, pricing, or booking!", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Add a small delay so user can see what they said before sending
        setTimeout(() => sendMessage(transcript), 600);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListen = () => {
    if (!SpeechRecognition) {
      alert("Voice not supported on this device. Try a modern browser like Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('Listening...');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate AI thinking time
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = getAIResponse(text);
      const botMsg = { id: Date.now() + 1, role: 'bot', text: response, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);

      if ('speechSynthesis' in window) {
        try {
          // clean up emojis and markdown for speech
          const plainText = response
            .replace(/\*\*/g, '')
            .replace(/⭐/g, 'stars')
            .replace(/₹/g, 'rupees ')
            .replace(/🚗|💰|⚡|⛽|🌱|🔥|👑|🗺️|🐉|✨|✅/g, '');
          const utterance = new SpeechSynthesisUtterance(plainText);
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        } catch(e) {}
      }
    }, delay);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSampleClick = (q) => {
    sendMessage(q);
  };

  // Simple markdown-like rendering
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold
      let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className={`chatbot-fab ${open ? 'chatbot-fab--open' : ''}`}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
              className="chatbot-fab__content">
              <MessageCircle size={24} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && <span className="chatbot-fab__badge">AI</span>}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div className="chatbot"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="chatbot__header">
              <div className="chatbot__header-info">
                <div className="chatbot__avatar">🐉</div>
                <div>
                  <h4>Dragon AI</h4>
                  <span className="chatbot__status">
                    <span className="chatbot__status-dot" /> Online
                  </span>
                </div>
              </div>
              <button className="chatbot__close" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot__messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chatbot__msg chatbot__msg--${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.role === 'bot' && <div className="chatbot__msg-avatar">🐉</div>}
                  <div className="chatbot__msg-content">
                    {renderText(msg.text)}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div className="chatbot__msg chatbot__msg--bot"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="chatbot__msg-avatar">🐉</div>
                  <div className="chatbot__msg-content chatbot__typing">
                    <span /><span /><span />
                  </div>
                </motion.div>
              )}

              {/* Sample questions (only show if few messages) */}
              {messages.length <= 1 && !typing && (
                <div className="chatbot__samples">
                  <p className="chatbot__samples-label"><Sparkles size={12} /> Try asking:</p>
                  {SAMPLE_QUESTIONS.map((q, i) => (
                    <button key={i} className="chatbot__sample-btn" onClick={() => handleSampleClick(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chatbot__input-area" onSubmit={handleSubmit}>
              <button
                type="button"
                className={`chatbot__mic ${isListening ? 'chatbot__mic--listening' : ''}`}
                onClick={toggleListen}
                title="Use Voice"
                disabled={typing}
              >
                <Mic size={18} />
              </button>
              <input
                ref={inputRef}
                type="text"
                className="chatbot__input"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={typing}
              />
              <button type="submit" className="chatbot__send" disabled={!input.trim() || typing}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
