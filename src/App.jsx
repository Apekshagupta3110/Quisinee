import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TableSelection from './pages/TableSelection';
import AdminLogin from './pages/AdminLogin';
import CustomerMenu from './pages/CustomerMenu';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="bg-cream min-h-screen w-full flex justify-center items-start">
      <div className="w-full max-w-[450px] bg-white min-h-screen shadow-[0_0_50px_rgba(0,0,0,0.1)] relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/select-table" element={<TableSelection />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/menu/:tableId" element={<CustomerMenu />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
