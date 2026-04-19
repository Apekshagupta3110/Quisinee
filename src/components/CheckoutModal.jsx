import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, PartyPopper } from 'lucide-react';
import useStore from '../store/useStore';

export default function CheckoutModal({ open, onClose }) {
  const cart = useStore((s) => s.cart);
  const getCartTotal = useStore((s) => s.getCartTotal);
  const placeOrder = useStore((s) => s.placeOrder);
  const collaborativeMode = useStore((s) => s.collaborativeMode);
  const setCollaborativeMode = useStore((s) => s.setCollaborativeMode);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = getCartTotal();

  const handlePlace = () => {
    placeOrder();
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      onClose();
    }, 2500);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] flex flex-col"
        >
          <AnimatePresence mode="wait">
            {!orderPlaced ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h2 className="font-serif text-xl font-bold text-headline">
                    Your Order
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-sage-50"
                  >
                    <X className="w-5 h-5 text-sage-400" />
                  </button>
                </div>
                <div className="px-5 pb-3">
                  <button
                    type="button"
                    onClick={() => setCollaborativeMode(!collaborativeMode)}
                    className={`w-full rounded-xl border px-3 py-2.5 flex items-center justify-between transition-colors ${
                      collaborativeMode
                        ? 'bg-sage-50 border-sage-300'
                        : 'bg-white border-sage-100'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-sage-700">
                      <PartyPopper className="w-4 h-4" style={{ color: '#8BA888' }} />
                      Collaborative Mode
                    </span>
                    <span
                      className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        collaborativeMode ? 'bg-sage-300' : 'bg-sage-100'
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                          collaborativeMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </span>
                  </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-sage-50 rounded-xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sage-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-sage-400">Qty: {item.qty}</p>
                      </div>
                      <span className="text-sm font-bold text-sage-700">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-sage-100 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sage-500 font-medium">Total</span>
                    <span className="text-xl font-bold text-headline">
                      ₹{total}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePlace}
                    className="w-full bg-primary text-white rounded-xl py-3.5 font-semibold hover:bg-terracotta-400 transition-colors"
                  >
                    Place Order
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 px-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-sage-300" />
                </motion.div>
                <h3 className="font-serif text-2xl font-bold text-headline mt-4">
                  Order Placed!
                </h3>
                <p className="text-sage-400 text-sm mt-1">
                  Your food is being prepared
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
