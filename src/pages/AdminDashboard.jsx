import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  LogOut,
  ChevronRight,
  Clock,
  CookingPot,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';
import useStore from '../store/useStore';

// --- Kanban Board ---
function KanbanBoard() {
  const orders = useStore((s) => s.orders);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);

  const columns = [
    { status: 'New', icon: Clock, color: 'terracotta', next: 'Preparing' },
    { status: 'Preparing', icon: CookingPot, color: 'amber', next: 'Served' },
    { status: 'Served', icon: CheckCircle2, color: 'sage', next: null },
  ];

  const colorMap = {
    terracotta: {
      bg: 'bg-terracotta-50',
      border: 'border-terracotta-200',
      badge: 'bg-terracotta-300 text-white',
      icon: 'text-terracotta-400',
      btn: 'bg-primary hover:bg-terracotta-400 text-white',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-500 text-white',
      icon: 'text-amber-500',
      btn: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    sage: {
      bg: 'bg-sage-50',
      border: 'border-sage-200',
      badge: 'bg-sage-300 text-white',
      icon: 'text-sage-400',
      btn: '',
    },
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-headline mb-4">
        Live Orders
      </h2>
      {orders.length === 0 && (
        <div className="text-center py-16 text-sage-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No orders yet. They'll appear here in real-time.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ status, icon: Icon, color, next }) => {
          const cm = colorMap[color];
          const colOrders = orders.filter((o) => o.status === status);
          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${cm.icon}`} />
                <h3 className="font-semibold text-sage-700 text-sm">{status}</h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cm.badge}`}>
                  {colOrders.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                <AnimatePresence>
                  {colOrders.map((order) => (
                    <motion.div
                      key={order.orderId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className={`${cm.bg} border ${cm.border} rounded-xl p-3`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-sage-400">
                          {order.orderId}
                        </span>
                        <span className="text-xs text-sage-500">
                          Table {order.tableNumber}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-sage-800 mb-1">
                        {order.customerName}
                      </p>
                      <div className="space-y-0.5 mb-2">
                        {order.items.map((it) => (
                          <p key={it.id} className="text-xs text-sage-500">
                            {it.name} × {it.qty}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-sage-700">
                          ₹{order.totalAmount}
                        </span>
                        {next && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateOrderStatus(order.orderId, next)}
                            className={`text-xs font-medium px-3 py-1 rounded-full ${cm.btn} flex items-center gap-1`}
                          >
                            {next}
                            <ChevronRight className="w-3 h-3" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Menu Management ---
function MenuManagement() {
  const menuItems = useStore((s) => s.menuItems);
  const toggleAvailability = useStore((s) => s.toggleAvailability);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-headline mb-4">
        Menu Management
      </h2>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-sage-100 bg-sage-50/80">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal w-14">
                #
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal min-w-[200px]">
                Item
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal min-w-[120px]">
                Category
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal min-w-[96px]">
                Price
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal text-center min-w-[160px]">
                Available
              </th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, i) => (
              <motion.tr
                key={item.id}
                layout
                className={`border-b border-sage-50 last:border-b-0 ${
                  !item.isAvailable ? 'bg-gray-50/80 opacity-60' : ''
                }`}
              >
                <td className="px-5 py-4 align-middle text-xs text-sage-400 whitespace-nowrap">
                  {i + 1}
                </td>
                <td className="px-5 py-4 align-middle">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <span className="text-sm font-medium text-sage-800 truncate">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 align-middle text-sm text-sage-600 whitespace-nowrap">
                  {item.category}
                </td>
                <td className="px-5 py-4 align-middle text-sm font-semibold text-terracotta-300 whitespace-nowrap">
                  ₹{item.price}
                </td>
                <td className="px-5 py-4 align-middle">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(item.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                        item.isAvailable ? 'bg-sage-300' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        layout
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                        style={{ left: item.isAvailable ? '22px' : '2px' }}
                      />
                    </button>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        item.isAvailable ? 'text-sage-500' : 'text-red-400'
                      }`}
                    >
                      {item.isAvailable ? 'Live' : 'Sold Out'}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function AdminDashboard() {
  const navigate = useNavigate();
  const logoutAdmin = useStore((s) => s.logoutAdmin);
  const orders = useStore((s) => s.orders);
  const [tab, setTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const navItems = [
    { id: 'orders', label: 'Live Orders', icon: ClipboardList, badge: orders.filter((o) => o.status === 'New').length },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed, badge: 0 },
  ];

  const Sidebar = ({ mobile = false }) => (
    <div
      className={`flex flex-col bg-white border-r border-sage-100 ${
        mobile
          ? 'w-64 h-full'
          : 'hidden lg:flex fixed left-0 top-0 z-30 w-64 h-screen'
      }`}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sage-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-sage-300" />
          <h1 className="font-serif text-lg font-bold text-headline">QUISINE</h1>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-sage-400" />
          </button>
        )}
      </div>
      <div className="flex-1 py-3 px-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              if (mobile) setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-terracotta-50 text-headline'
                : 'text-sage-500 hover:bg-sage-50 hover:text-sage-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {badge > 0 && (
              <span className="ml-auto bg-terracotta-300 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="px-3 py-4 border-t border-sage-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 bg-cream">
        {/* Top bar */}
        <div className="sticky top-0 z-20 mb-4 sm:mb-6 bg-white/80 backdrop-blur-md border border-sage-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1 shrink-0"
          >
            <Menu className="w-5 h-5 text-sage-600" />
          </button>
          <h2 className="font-semibold text-headline">
            {tab === 'orders' ? 'Live Orders' : 'Menu Management'}
          </h2>
          <span className="ml-auto text-xs text-sage-400 bg-sage-50 px-2 py-1 rounded-full shrink-0">
            Admin
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {tab === 'orders' ? (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <KanbanBoard />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <MenuManagement />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
