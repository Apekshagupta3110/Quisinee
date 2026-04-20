import { motion } from 'framer-motion';
import { Plus, Minus, Box, Star } from 'lucide-react';
import useStore from '../store/useStore';

export default function MenuCard({ item, onAR, index = 0 }) {
  const cart = useStore((s) => s.cart);
  const addToCart = useStore((s) => s.addToCart);
  const removeFromCart = useStore((s) => s.removeFromCart);

  const cartItem = cart.find((c) => (c._id || c.id) === (item._id || item.id));
  const qty = cartItem?.qty || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
       !(item.isAvailable ?? item.inStock) ? 'opacity-50 grayscale pointer-events-none' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Badges */}
        {item.isChefSpecial && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow">
            <Star className="w-2.5 h-2.5 fill-white" /> Bestseller
          </span>
        )}
        {!(item.isAvailable ?? item.inStock) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-charcoal text-xs font-bold px-3 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}
        {/* AR Button */}
        <button
          onClick={() => onAR(item)}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow hover:bg-white transition-colors"
          title="View in 3D"
        >
          <Box className="w-4 h-4 text-charcoal" />
        </button>
        {/* Price pill on image */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-0.5 shadow">
          <span className="text-charcoal font-bold text-sm">₹{item.price}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-charcoal leading-tight">
          {item.name}
        </h3>
        <p className="text-charcoal-lighter text-xs mt-0.5 line-clamp-2">
          {item.description}
        </p>

        {/* Taste Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tasteTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-crisp text-charcoal-lighter px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Quantity Controls */}
        <div className="mt-3">
          {qty === 0 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(item)}
              className="w-full bg-primary text-white text-sm font-semibold py-2 rounded-xl hover:bg-terracotta-400 transition-colors shadow-sm"
            >
              + ADD
            </motion.button>
          ) : (
            <div className="flex items-center justify-center gap-3 bg-tomato-50 rounded-xl py-1.5 px-3">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => removeFromCart(item._id || item.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-tomato-400"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="font-bold text-charcoal w-6 text-center">
                {qty}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => addToCart(item)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-primary shadow-sm text-white"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
