import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, ShieldCheck, UtensilsCrossed } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #f0f4ef 0%, #F9F8F6 50%, #fbe0d6 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sage-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-terracotta-200/30 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <UtensilsCrossed className="mx-auto w-12 h-12 text-sage-300 mb-3" />
            <h1 className="font-serif text-5xl font-bold text-headline tracking-tight">
              QUISINE
            </h1>
            <p className="text-sage-400 text-sm mt-1 tracking-widest uppercase">
              Smart Dining Experience
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {/* Customer Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full bg-white/80 backdrop-blur-sm border border-sage-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
              <LogIn className="w-7 h-7 text-sage-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-headline">
                Dine In: Sign In
              </h2>
              <p className="text-sage-400 text-sm mt-0.5">
                Sign in to your account and start ordering
              </p>
            </div>
          </motion.button>

          {/* Admin Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin-login')}
            className="w-full bg-white/80 backdrop-blur-sm border border-terracotta-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-terracotta-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-7 h-7 text-terracotta-500" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-headline">
                Restaurant Login
              </h2>
              <p className="text-sage-400 text-sm mt-0.5">
                Admin access to manage orders &amp; menu
              </p>
            </div>
          </motion.button>
        </div>

        <p className="text-center text-sage-300 text-xs mt-8">
          &copy; {new Date().getFullYear()} QUISINE &middot; Crafted with care
        </p>
      </motion.div>
    </div>
  );
}
