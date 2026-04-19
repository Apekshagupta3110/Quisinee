import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';

export default function CartBar({ onCheckout }) {
  const cart = useStore((s) => s.cart);
  const getCartTotal = useStore((s) => s.getCartTotal);
  const getCartCount = useStore((s) => s.getCartCount);

  const count = getCartCount();
  const total = getCartTotal();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-3"
        >
          <button
            onClick={onCheckout}
            className="w-full max-w-lg mx-auto flex items-center justify-between bg-primary text-white rounded-2xl px-5 py-3.5 shadow-lg hover:bg-terracotta-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-terracotta-300 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              </div>
              <span className="font-medium text-sm">
                {count} item{count > 1 ? 's' : ''} in cart
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">₹{total}</span>
              <span className="text-sage-100">→</span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
