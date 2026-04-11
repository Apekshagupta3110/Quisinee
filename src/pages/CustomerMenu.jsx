import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, User, Hash, LogOut, UserRound } from 'lucide-react';
import useStore from '../store/useStore';
import ChefSpecials from '../components/ChefSpecials';
import MenuCard from '../components/MenuCard';
import CartBar from '../components/CartBar';
import CheckoutModal from '../components/CheckoutModal';
import ARModal from '../components/ARModal';
import ChatBot from '../components/ChatBot';
import { publishTableCartUpdate, subscribeToTableCartChannel } from '../lib/pusherCartSync';

const CATEGORY_META = {
  'Starters': { emoji: '🔥', label: 'Starters' },
  'Main Course': { emoji: '🍛', label: 'Main Course' },
  'Beverages & Desserts': { emoji: '🍹', label: 'Beverages & Desserts' },
};

export default function CustomerMenu() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const dbMenu = useStore((s) => s.dbMenu);
  const fetchMenu = useStore((s) => s.fetchMenu);
  const menuLoading = useStore((s) => s.menuLoading);
  const auth = useStore((s) => s.auth);
  const cart = useStore((s) => s.cart);
  const collaborativeMode = useStore((s) => s.collaborativeMode);
  const mergeRemoteCartItems = useStore((s) => s.mergeRemoteCartItems);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [arItem, setArItem] = useState(null);
  const sessionRef = useRef(
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
  const suppressBroadcastRef = useRef(false);
  const previousCartRef = useRef(cart);

  const customerName = auth.customerName || 'Guest';
  const chefSpecials = dbMenu.filter((i) => i.isChefSpecial && i.inStock);
  const tableChannelName = String(auth.tableNumber || tableId || '');

  // Group items by category in display order
  const sections = useMemo(() => {
  const order = ['Starters', 'Main Course', 'Beverages & Desserts'];
  return order
    .map((cat) => ({
      category: cat,
      meta: CATEGORY_META[cat] || { emoji: '🍽️', label: cat },
      items: dbMenu.filter((i) => i.category === cat && i.inStock),
    }))
    .filter((s) => s.items.length > 0);
}, [dbMenu]);

  useEffect(() => {
    if (!collaborativeMode || !tableChannelName) return undefined;
    const unsubscribe = subscribeToTableCartChannel(tableChannelName, (eventData) => {
      const payload = eventData?.payload || eventData;
      if (!payload?.items?.length) return;
      if (payload.senderId === sessionRef.current) return;
      suppressBroadcastRef.current = true;
      mergeRemoteCartItems(payload.items);
    });
    return () => {
      unsubscribe?.();
    };
  }, [collaborativeMode, tableChannelName, mergeRemoteCartItems]);

  useEffect(() => {
    const previousCart = previousCartRef.current;
    if (!collaborativeMode || !tableChannelName) {
      previousCartRef.current = cart;
      return;
    }
    if (suppressBroadcastRef.current) {
      suppressBroadcastRef.current = false;
      previousCartRef.current = cart;
      return;
    }
    const previousMap = new Map(previousCart.map((item) => [item.id, item]));
    const currentMap = new Map(cart.map((item) => [item.id, item]));
    const uniqueIds = new Set([...previousMap.keys(), ...currentMap.keys()]);
    const deltas = [];
    uniqueIds.forEach((id) => {
      const previousQty = previousMap.get(id)?.qty || 0;
      const currentItem = currentMap.get(id);
      const currentQty = currentItem?.qty || 0;
      const qtyDelta = currentQty - previousQty;
      if (!qtyDelta) return;
      const baseItem = currentItem || previousMap.get(id);
      deltas.push({ ...baseItem, qtyDelta });
    });
    if (deltas.length > 0) {
      publishTableCartUpdate(tableChannelName, {
        senderId: sessionRef.current,
        tableNumber: tableChannelName,
        items: deltas,
      });
    }
    previousCartRef.current = cart;
  }, [cart, collaborativeMode, tableChannelName]);

  useEffect(() => { fetchMenu(); }, []);

  if (menuLoading && dbMenu.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-crisp">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-charcoal-lighter">Loading menu...</p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-crisp pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-tomato-300" />
            <h1 className="font-serif text-xl font-bold text-headline">QUISINE</h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-charcoal-lighter">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {customerName}
            </span>
            <span className="flex items-center gap-1 bg-tomato-50 text-tomato-400 px-2 py-0.5 rounded-full font-semibold">
              <Hash className="w-3 h-3" />
              Table {tableId}
            </span>
            <button
              onClick={() => navigate('/profile')}
              className="p-1 rounded-full hover:bg-gray-100"
              title="Profile"
            >
              <UserRound className="w-4 h-4 text-charcoal-lighter" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="p-1 rounded-full hover:bg-gray-100"
              title="Exit"
            >
              <LogOut className="w-4 h-4 text-charcoal-lighter" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Chef Specials */}
        <ChefSpecials items={chefSpecials} />

        {/* Category Sections */}
        {sections.map((section) => (
          <div key={section.category} className="mb-6">
            {/* Section Header */}
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-lg font-bold text-headline flex items-center gap-2">
                <span className="text-xl">{section.meta.emoji}</span>
                {section.meta.label}
                <span className="text-xs font-normal text-charcoal-lighter ml-1">
                  ({section.items.length})
                </span>
              </h2>
            </div>
            
            {/* Grid */}
<div className="grid grid-cols-2 gap-3 px-4">
  {section.items.map((item, i) => (
    <MenuCard key={item._id || item.id} item={item} onAR={setArItem} index={i} />
  ))}
</div>
          </div>
        ))}
      </div>

      {/* Cart Bar */}
      <CartBar onCheckout={() => setCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* AR Modal */}
      <ARModal
        open={!!arItem}
        item={arItem}
        onClose={() => setArItem(null)}
      />

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
