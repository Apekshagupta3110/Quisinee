import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import useStore from '../store/useStore';

const MOODS = ['Hungry', 'Light Bite', 'Celebrating', 'Comfort Food'];
const TASTES = ['Spicy', 'Sweet', 'Creamy', 'Crispy', 'Smoky'];
const BUDGETS = ['Under ₹150', '₹150–250', '₹250+'];

function parseBudget(label) {
  if (label === 'Under ₹150') return [0, 150];
  if (label === '₹150–250') return [150, 250];
  return [250, 9999];
}

export default function ChatBot() {
  const menuItems = useStore((s) => s.dbMenu);
  const addToCart = useStore((s) => s.addToCart);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0=mood 1=taste 2=budget 3=results
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [selections, setSelections] = useState({ mood: '', taste: '', budget: '' });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const addBotMessage = (text, delay = 600) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text }]);
    }, delay);
  };

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{ from: 'bot', text: "Hi! I'm your food assistant 🍽️ Let me help you pick something delicious." }]);
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: 'bot', text: "What's your mood right now?" }]);
        setStep(0);
      }, 800);
    }
  };

  const handleSelect = (type, value) => {
    const updated = { ...selections, [type]: value };
    setSelections(updated);
    setMessages((prev) => [...prev, { from: 'user', text: value }]);

    if (type === 'mood') {
      addBotMessage('Nice! What flavours are you craving?');
      setStep(1);
    } else if (type === 'taste') {
      addBotMessage('And what about your budget?');
      setStep(2);
    } else if (type === 'budget') {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const [min, max] = parseBudget(value);
        const recs = menuItems
          .filter((it) => it.isAvailable)
          .filter((it) => it.price >= min && it.price <= max)
          .filter(
            (it) =>
              it.tasteTags.some((t) =>
                t.toLowerCase().includes(updated.taste.toLowerCase())
              ) || true
          )
          .sort((a, b) => {
            const aMatch = a.tasteTags.some((t) =>
              t.toLowerCase().includes(updated.taste.toLowerCase())
            );
            const bMatch = b.tasteTags.some((t) =>
              t.toLowerCase().includes(updated.taste.toLowerCase())
            );
            return bMatch - aMatch;
          })
          .slice(0, 2);

        if (recs.length > 0) {
          setMessages((prev) => [
            ...prev,
            { from: 'bot', text: `Based on your ${updated.mood} mood with ${updated.taste} cravings, I'd recommend:` },
            ...recs.map((r) => ({
              from: 'bot',
              rec: r,
              text: `🍴 ${r.name} — ₹${r.price}\n${r.description}`,
            })),
            { from: 'bot', text: 'Tap "Add" to add them to your cart! Want to try again? Just pick a new mood.' },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { from: 'bot', text: "Hmm, nothing matched perfectly, but here are our top picks!" },
            ...menuItems
              .filter((it) => it.inStock)
              .slice(0, 2)
              .map((r) => ({
                from: 'bot',
                rec: r,
                text: `🍴 ${r.name} — ₹${r.price}\n${r.description}`,
              })),
          ]);
        }
        setStep(0);
        setSelections({ mood: '', taste: '', budget: '' });
      }, 1200);
    }
  };

  const pills =
    step === 0 ? MOODS : step === 1 ? TASTES : step === 2 ? BUDGETS : [];
  const pillType = step === 0 ? 'mood' : step === 1 ? 'taste' : 'budget';

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpen}
            className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-terracotta-400 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 left-4 z-50 sm:left-auto sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-sage-100"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-sage-300 px-4 py-3 text-white">
              <div>
                <h3 className="font-semibold text-sm">QUISINE Assistant</h3>
                <p className="text-sage-100 text-xs">AI-powered food recommendations</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-sage-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-sage-50/50"
              style={{ minHeight: 200 }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.from === 'user'
                        ? 'bg-sage-300 text-white rounded-br-sm'
                        : 'bg-white text-sage-800 rounded-bl-sm shadow-sm border border-sage-100'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.rec && (
                      <button
                        onClick={() => addToCart(msg.rec)}
                        className="mt-2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full hover:bg-terracotta-400 transition-colors"
                      >
                        + Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm border border-sage-100">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pill Buttons */}
            {pills.length > 0 && !typing && (
              <div className="px-4 py-3 border-t border-sage-100 bg-white">
                <div className="flex flex-wrap gap-2">
                  {pills.map((p) => (
                    <motion.button
                      key={p}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(pillType, p)}
                      className="bg-sage-50 text-sage-700 text-xs font-medium px-3 py-1.5 rounded-full border border-sage-200 hover:bg-sage-100 transition-colors"
                    >
                      {p}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
