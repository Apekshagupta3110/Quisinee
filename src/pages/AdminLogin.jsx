import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const loginAdmin = useStore((s) => s.loginAdmin);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      loginAdmin();
      navigate('/admin');
    } else {
      setError('Invalid credentials. Try admin / admin123');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="bg-white max-w-[450px] mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/60 backdrop-blur-md border-b border-terracotta-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-1">
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </button>
        <h1 className="text-xl font-bold text-charcoal font-serif">Admin Login</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-terracotta-100">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-terracotta-400" />
              </div>
              <h2 className="font-semibold text-lg text-charcoal font-serif">Restaurant Admin</h2>
              <p className="text-charcoal/60 text-sm">Sign in to manage your restaurant</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-300" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-terracotta-50 border border-terracotta-100 text-charcoal placeholder:text-charcoal/45 focus:outline-none focus:ring-2 focus:ring-terracotta-200 text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-300" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-terracotta-50 border border-terracotta-100 text-charcoal placeholder:text-charcoal/45 focus:outline-none focus:ring-2 focus:ring-terracotta-200 text-sm"
                />
              </div>
              <button
               type="submit"
               className="w-full bg-terracotta-300 text-white rounded-xl py-3 font-semibold shadow-lg shadow-terracotta-200/40 hover:bg-terracotta-400 transition-colors"
               >
                Sign In
              </button>
            </form>
          </div>

          {/* Error Toast */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 flex items-center gap-2 text-sm"
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
