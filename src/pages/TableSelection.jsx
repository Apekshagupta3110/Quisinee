import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, LogOut, QrCode, UserRound } from 'lucide-react';
import useStore from '../store/useStore';
import QRScanner from '../components/QRScanner';

const TABLES = [1, 2, 3, 4, 5, 6];

export default function TableSelection() {
  const navigate = useNavigate();
  const auth = useStore((s) => s.auth);
  const setTable = useStore((s) => s.setTable);
  const logoutCustomer = useStore((s) => s.logoutCustomer);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Guard: redirect to login if not authenticated as Customer
  if (auth.role !== 'Customer') {
    return <Navigate to="/login" replace />;
  }

  const handleSelect = (tableNum) => {
    setTable(tableNum);
    navigate(`/menu/${tableNum}`);
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
      <div className="sticky top-0 z-20 bg-white/60 backdrop-blur-md border-b border-sage-100 px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif text-xl font-bold text-headline">Select Table</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/profile')}
            className="p-1.5 rounded-full hover:bg-sage-50"
            title="Profile"
          >
            <UserRound className="w-4 h-4 text-sage-500" />
          </button>
          <button
            onClick={() => {
              logoutCustomer();
              navigate('/');
            }}
            className="p-1.5 rounded-full hover:bg-sage-50"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-sage-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-100">
            {/* Welcome */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-sage-600" />
              </div>
              <h2 className="font-semibold text-lg text-headline">
                Welcome, {auth.customerName}!
              </h2>
              <p className="text-sage-400 text-sm mt-0.5">
                Which table are you seated at?
              </p>
            </div>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full mb-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-charcoal text-white font-medium shadow-lg shadow-charcoal/20 hover:bg-charcoal-light transition-colors"
            >
              <QrCode className="w-4 h-4" />
              Scan Table QR
            </button>

            {/* Table Grid */}
            <div className="grid grid-cols-3 gap-3">
              {TABLES.map((num, i) => (
                <motion.button
                  key={num}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(num)}
                  className="flex flex-col items-center justify-center bg-sage-50 border border-sage-200 rounded-xl py-5 hover:bg-sage-100 hover:border-sage-300 transition-colors group"
                >
                  <span className="text-2xl font-bold text-sage-700 group-hover:text-sage-800">
                    {num}
                  </span>
                  <span className="text-[11px] text-sage-400 mt-0.5 font-medium">
                    Table {num}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <QRScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
}
