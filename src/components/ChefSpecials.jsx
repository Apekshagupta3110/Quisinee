import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

export default function ChefSpecials({ items }) {
  const addToCart = useStore((s) => s.addToCart);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(false);

  if (!items.length) return null;

  const handleAdd = () => {
    if (!selectedItem) return;
    addToCart(selectedItem);
    setSelectedItem(null);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <>
      <div className="py-5">
        {/* Section Header */}
        <div className="flex items-center gap-2 px-4 mb-4">
          <Sparkles className="w-4 h-4 text-gold" />
          <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">
            Chef's Specials
          </h2>
        </div>

        {/* Horizontal Scroll */}
        <div
          className="flex gap-4 px-4 overflow-x-auto no-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 260 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedItem(item)}
              className="flex flex-col items-center flex-shrink-0 w-[76px] group"
            >
              {/* Gradient Ring */}
              <div className="w-[68px] h-[68px] rounded-full p-[3px] bg-gradient-to-br from-yellow-400 via-pink-500 to-red-500 shadow-md group-hover:shadow-lg transition-shadow">
                <div className="w-full h-full rounded-full p-[2px] bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <p className="text-[11px] text-charcoal mt-1.5 text-center leading-tight line-clamp-2 font-medium">
                {item.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Glassmorphism Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            onClick={() => setSelectedItem(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <span className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  CHEF'S SPECIAL
                </span>
                <h3 className="text-xl font-bold text-charcoal mt-3">
                  {selectedItem.name}
                </h3>
                <p className="text-charcoal-lighter text-sm mt-1.5 leading-relaxed">
                  {selectedItem.description}
                </p>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-2xl font-bold text-charcoal">
                    ₹{selectedItem.price}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={handleAdd}
                  className="flex items-center gap-2 bg-primary hover:bg-terracotta-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-charcoal text-white px-5 py-3 rounded-xl shadow-xl"
          >
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
