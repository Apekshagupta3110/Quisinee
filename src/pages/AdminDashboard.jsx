import { useState, useEffect } from 'react';
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
import MenuManager from '../components/MenuManager';
import StoryManager from '../components/StoryManager';

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

  const getETA = (status, timestamp) => {
    const elapsed = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (status === 'New') return { label: 'Just placed', eta: '~10 min', color: 'text-orange-500' };
    if (status === 'Preparing') return { label: `${elapsed}m ago`, eta: '~5 min', color: 'text-amber-500' };
    if (status === 'Served') return { label: 'Completed', eta: null, color: 'text-green-500' };
    return { label: '', eta: null, color: '' };
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
                  {colOrders.map((order) => {
                    const etaInfo = getETA(order.status, order.timestamp);
                    return (
                      <motion.div
                        key={order.orderId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className={`${cm.bg} border ${cm.border} rounded-xl p-3`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-sage-400">
                            {order.orderId}
                          </span>
                          <span className="text-xs text-sage-500">
                            Table {order.tableNumber}
                          </span>
                        </div>

                        {/* ETA Row */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-semibold ${etaInfo.color}`}>
                            {etaInfo.label}
                          </span>
                          {etaInfo.eta && (
                            <span className="text-[10px] bg-white text-sage-600 px-2 py-0.5 rounded-full border border-sage-100">
                              Ready in {etaInfo.eta}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-medium text-sage-800 mb-0.5">
                          {order.customerName}
                        </p>
                        <p className="text-[10px] text-sage-400 mb-1">
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>

                        <div className="space-y-0.5 mb-2">
                          {order.items.map((it) => (
                            <p key={it._id || it.id} className="text-xs text-sage-500">
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
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Menu Management (DB-backed) ---
function MenuManagement() {
  const dbMenu = useStore((s) => s.dbMenu);
  const fetchMenu = useStore((s) => s.fetchMenu);
  const updateMenuItem = useStore((s) => s.updateMenuItem);
  const menuLoading = useStore((s) => s.menuLoading);

  const [prices, setPrices] = useState({});

  useEffect(() => { fetchMenu(); }, []);

  // Sync local price state when dbMenu loads
  useEffect(() => {
    const initial = {};
    dbMenu.forEach((item) => { initial[item._id] = String(item.price); });
    setPrices(initial);
  }, [dbMenu]);

  const handlePriceBlur = async (item) => {
    const newPrice = Number(prices[item._id]);
    if (!isNaN(newPrice) && newPrice > 0 && newPrice !== item.price) {
      await updateMenuItem(item._id, { price: newPrice });
    } else {
      setPrices((prev) => ({ ...prev, [item._id]: String(item.price) }));
    }
  };


const handleToggleStock = async (item) => {
  await updateMenuItem(item._id, { inStock: !item.inStock });
  await fetchMenu();
};

  if (menuLoading && dbMenu.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-headline mb-4">
        Menu Management
      </h2>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-sage-100 bg-sage-50/80">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal w-14">#</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal min-w-[200px]">Item</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal min-w-[120px]">Category</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal min-w-[120px]">Price</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal text-center min-w-[160px]">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {dbMenu.map((item, i) => (
              <motion.tr
                key={item._id}
                layout
                className={`border-b border-sage-50 last:border-b-0 ${
                  !item.inStock ? 'bg-gray-50/80 opacity-60' : ''
                }`}
              >
                <td className="px-5 py-4 align-middle text-xs text-sage-400 whitespace-nowrap">
                  {i + 1}
                </td>
                <td className="px-5 py-4 align-middle">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80'; }}
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
                <td className="px-5 py-4 align-middle">
                  <div className="flex items-center gap-1">
                    <span className="text-sage-400 text-sm">₹</span>
                    <input
                      type="number"
                      value={prices[item._id] ?? item.price}
                      onChange={(e) => setPrices((prev) => ({ ...prev, [item._id]: e.target.value }))}
                      onBlur={() => handlePriceBlur(item)}
                      className="w-20 px-2 py-1 border border-sage-200 rounded-lg text-sm font-semibold text-terracotta-300 focus:outline-none focus:border-sage-400"
                    />
                  </div>
                </td>
                <td className="px-5 py-4 align-middle">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(item)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                        item.inStock ? 'bg-sage-300' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        layout
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                        style={{ left: item.inStock ? '22px' : '2px' }}
                      />
                    </button>
                    <span className={`text-xs font-medium whitespace-nowrap ${
                      item.inStock ? 'text-sage-500' : 'text-red-400'
                    }`}>
                      {item.inStock ? 'Live' : 'Sold Out'}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {dbMenu.length === 0 && !menuLoading && (
          <div className="text-center py-12 text-sage-400 text-sm">
            No items in database yet. Add some via Menu Manager.
          </div>
        )}
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
    { id: 'menu-manager', label: 'Menu Manager', icon: UtensilsCrossed, badge: 0 },
    { id: 'story-manager', label: 'Story Manager', icon: LayoutDashboard, badge: 0 },
  ];

  const Sidebar = ({ mobile = false }) => (
    <div
      className={`flex flex-col bg-white border-r border-sage-100 ${
        mobile
          ? 'w-64 h-full'
            :'hidden lg:flex sticky top-0 self-start w-64 h-screen flex-shrink-0'
      }`}
    >
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
      <Sidebar />

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

<div className="flex-1 min-w-0 flex flex-col min-h-screen p-4 sm:p-6 lg:p-8 bg-cream">
        <div className="sticky top-0 z-20 mb-4 sm:mb-6 bg-white/80 backdrop-blur-md border border-sage-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 shrink-0">
            <Menu className="w-5 h-5 text-sage-600" />
          </button>
          <h2 className="font-semibold text-headline">
            {tab === 'orders' ? 'Live Orders' :
             tab === 'menu' ? 'Menu Management' :
             tab === 'menu-manager' ? 'Menu Manager' :
             tab === 'story-manager' ? 'Story Manager' : 'Dashboard'}
          </h2>
          <span className="ml-auto text-xs text-sage-400 bg-sage-50 px-2 py-1 rounded-full shrink-0">
            Admin
          </span>
        </div>

        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {tab === 'orders' ? (
              <motion.div key="orders" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <KanbanBoard />
              </motion.div>
            ) : tab === 'menu' ? (
              <motion.div key="menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <MenuManagement />
              </motion.div>
            ) : tab === 'menu-manager' ? (
              <motion.div key="menu-manager" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <MenuManager />
              </motion.div>
            ) : tab === 'story-manager' ? (
              <motion.div key="story-manager" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <StoryManager />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}