import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, AlertCircle, UtensilsCrossed } from 'lucide-react';
import useStore from '../store/useStore';

export default function Login() {
  const navigate = useNavigate();
  const loginCustomer = useStore((s) => s.loginCustomer);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // â”€â”€ CHANGED: async so it awaits the API call in useStore â”€â”€
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setLoading(true);
    const user = await loginCustomer(email, password);
    setLoading(false);
    if (user) {
      navigate('/select-table');
    } else {
      setError('Invalid email or password. Try test@test.com / password123');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          'linear-gradient(135deg, #f0f4ef 0%, #F9F8F6 50%, #fbe0d6 100%)',
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/60 backdrop-blur-md border-b border-sage-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-1">
          <ArrowLeft className="w-5 h-5 text-sage-600" />
        </button>
        <h1 className="font-serif text-xl font-bold text-headline">Sign In</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-100">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UtensilsCrossed className="w-6 h-6 text-sage-600" />
              </div>
              <h2 className="font-semibold text-lg text-headline">Welcome Back</h2>
              <p className="text-sage-400 text-sm">Sign in to start your dining experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-300" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-sage-50 border border-sage-100 text-sage-800 placeholder:text-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-300 text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-300" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-sage-50 border border-sage-100 text-sage-800 placeholder:text-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-300 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-terracotta-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing inâ€¦' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-sage-400 mt-5">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sage-600 font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Hint */}
          <div className="mt-3 bg-sage-50 border border-sage-100 rounded-xl px-4 py-2.5 text-center">
            <p className="text-xs text-sage-400">
              Demo credentials: <span className="font-medium text-sage-600">test@test.com</span> /{' '}
              <span className="font-medium text-sage-600">password123</span>
            </p>
          </div>

          {/* Error Toast */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 flex items-center gap-2 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

