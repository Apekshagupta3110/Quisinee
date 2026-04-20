import { create } from 'zustand';
import axios from 'axios';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const API = axios.create({ 
  baseURL: 'https://quisineee-server.onrender.com/api' 
});

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // data-URL string
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const initialMenuItems = [
  // ===== STARTERS =====
  {
    id: 1,
    name: 'Kurkuri Crispy Bhindi',
    category: 'Starters',
    price: 159,
    description: 'Thin-sliced okra deep-fried until impossibly crispy with chaat masala.',
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=480&q=80',
    isAvailable: true,
    isChefSpecial: false,
    tasteTags: ['Crispy', 'Spicy', 'Snack'],
  },
  {
    id: 2,
    name: 'Smoked Paneer Tikka',
    category: 'Starters',
    price: 219,
    description: 'Charcoal-smoked paneer cubes marinated in tandoori spices, grilled to perfection.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=480&q=80',
    isAvailable: true,
    isChefSpecial: true,
    tasteTags: ['Smoky', 'Spicy', 'Protein'],
  },
  {
    id: 3,
    name: 'Peri-Peri Fries',
    category: 'Starters',
    price: 139,
    description: 'Golden crispy fries tossed in fiery peri-peri seasoning with garlic aioli.',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=480&q=80',
    isAvailable: true,
    isChefSpecial: false,
    tasteTags: ['Crispy', 'Spicy', 'Comfort'],
  },
  {
    id: 4,
    name: 'Street-Style Cheese Maggi',
    category: 'Starters',
    price: 129,
    description: 'Classic Maggi tossed with butter, spices & loaded with melted cheese.',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=480&q=80',
    isAvailable: true,
    isChefSpecial: true,
    tasteTags: ['Spicy', 'Cheesy', 'Comfort'],
  },
  // ===== MAIN COURSE =====
  {
    id: 5,
    name: 'Truffle Butter Chicken',
    category: 'Main Course',
    price: 349,
    description: 'Creamy tomato curry with tender chicken, finished with truffle oil.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=480&q=80',
    isAvailable: true,
    isChefSpecial: true,
    tasteTags: ['Rich', 'Creamy', 'Premium'],
  },
  {
    id: 6,
    name: 'Authentic Gujarati Handvo',
    category: 'Main Course',
    price: 179,
    description: 'Savory rice-lentil cake with vegetables, tempered with mustard seeds.',
    image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=480&q=80',
    isAvailable: true,
    isChefSpecial: false,
    tasteTags: ['Savory', 'Healthy', 'Traditional'],
  },
  {
    id: 7,
    name: 'Tandoori Soya Chaap',
    category: 'Main Course',
    price: 229,
    description: 'Smoky soya chaap skewers basted in tandoori marinade, served with mint chutney.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=480&q=80',
    isAvailable: true,
    isChefSpecial: true,
    tasteTags: ['Smoky', 'Protein', 'Spicy'],
  },
  {
    id: 8,
    name: 'Butter Chicken Kulcha',
    category: 'Main Course',
    price: 289,
    description: 'Amritsari kulcha stuffed with spiced chicken, dripping in butter makhani.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=480&q=80',
    isAvailable: true,
    isChefSpecial: false,
    tasteTags: ['Rich', 'Buttery', 'Comfort'],
  },
  // ===== BEVERAGES & DESSERTS =====
  {
    id: 9,
    name: 'Aesthetic Rose Falooda',
    category: 'Beverages & Desserts',
    price: 199,
    description: 'Layered rose milk with vermicelli, basil seeds, ice cream & pistachios.',
    image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=480&q=80',
    isAvailable: true,
    isChefSpecial: true,
    tasteTags: ['Sweet', 'Cold', 'Aesthetic'],
  },
  {
    id: 10,
    name: 'Masala Chai Kulhad',
    category: 'Beverages & Desserts',
    price: 69,
    description: 'Authentic Indian spiced tea served in a traditional clay kulhad.',
    image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=480&q=80',
    isAvailable: true,
    isChefSpecial: false,
    tasteTags: ['Warm', 'Spicy', 'Traditional'],
  },
  {
    id: 11,
    name: 'Mango Lassi',
    category: 'Beverages & Desserts',
    price: 119,
    description: 'Thick, creamy yogurt shake blended with Alphonso mangoes & cardamom.',
    image: 'https://images.unsplash.com/photo-1527585743534-7113e3211270?w=480&q=80',
    isAvailable: true,
    isChefSpecial: false,
    tasteTags: ['Sweet', 'Creamy', 'Cold'],
  },
  {
    id: 12,
    name: 'Gulab Jamun',
    category: 'Beverages & Desserts',
    price: 99,
    description: 'Soft milk-solid dumplings soaked in warm rose-cardamom sugar syrup.',
    image: 'https://images.unsplash.com/photo-1601303516534-bf5f8b8e10f5?w=480&q=80',
    isAvailable: true,
    isChefSpecial: false,
    tasteTags: ['Sweet', 'Warm', 'Traditional'],
  },
];

const createUserProfile = (overrides = {}) => ({
  phone: '',
  avatarUrl: '',
  bio: '',
  dateOfBirth: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  preferences: {
    spiceLevel: 'Medium',
    dietaryPreferences: [],
    favoriteCuisine: '',
    newsletterOptIn: false,
  },
  addresses: [
    {
      label: 'Primary',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isPrimary: true,
    },
  ],
  ...overrides,
});

const initialUsers = [
  {
    email: 'test@test.com',
    password: 'password123',
    name: 'Test User',
    profile: createUserProfile({
      phone: '+91 98765 43210',
      bio: 'Food explorer & weekend dessert hunter.',
      preferences: {
        spiceLevel: 'Mild',
        dietaryPreferences: ['Vegetarian'],
        favoriteCuisine: 'North Indian',
        newsletterOptIn: true,
      },
      addresses: [
        {
          label: 'Home',
          line1: '25 River View Apartments',
          line2: 'Near City Mall',
          city: 'Surat',
          state: 'Gujarat',
          postalCode: '395007',
          country: 'India',
          isPrimary: true,
        },
      ],
    }),
  },
];

const mergeCartWithDeltas = (baseCart, deltas = []) => {
  const mergedMap = new Map(baseCart.map((item) => [item.id, { ...item }]));
  deltas.forEach((deltaItem) => {
    if (!deltaItem?.id) return;
    const qtyDelta = Number(deltaItem.qtyDelta ?? deltaItem.qty ?? 0);
    if (!qtyDelta) return;
    const existing = mergedMap.get(deltaItem.id);
    if (existing) {
      const nextQty = existing.qty + qtyDelta;
      if (nextQty <= 0) {
        mergedMap.delete(deltaItem.id);
      } else {
        mergedMap.set(deltaItem.id, { ...existing, qty: nextQty });
      }
      return;
    }
    if (qtyDelta > 0) {
      mergedMap.set(deltaItem.id, { ...deltaItem, qty: qtyDelta });
    }
  });
  return Array.from(mergedMap.values());
};

const useStore = create((set, get) => ({
  // ─────────────────────────────────────────────
  // Local Menu Items (kept for offline / fallback)
  // ─────────────────────────────────────────────
  menuItems: initialMenuItems,

  toggleAvailability: (id) =>
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      ),
    })),

  // ─────────────────────────────────────────────
  // DB-backed Menu (Admin Panel)
  // ─────────────────────────────────────────────
  dbMenu: [],
  menuLoading: false,
  menuError: null,

  fetchMenu: async () => {
    set({ menuLoading: true, menuError: null });
    try {
      const { data } = await API.get('/menu');
      set({ dbMenu: data, menuLoading: false });
    } catch (err) {
      set({ menuError: err.response?.data?.error ?? err.message, menuLoading: false });
    }
  },

  /**
   * createMenuItem({ name, price, category, description, imageFile, isChefSpecial, tasteTags })
   * Converts imageFile (File object) to Base64 before POSTing.
   */
  createMenuItem: async (fields) => {
    set({ menuLoading: true, menuError: null });
    try {
      const image = fields.imageFile ? await toBase64(fields.imageFile) : '';
      const payload = {
        name: fields.name,
        price: Number(fields.price),
        category: fields.category,
        description: fields.description ?? '',
        image,
        inStock: fields.inStock ?? true,
        isChefSpecial: fields.isChefSpecial ?? false,
        tasteTags: fields.tasteTags ?? [],
      };
      const { data } = await API.post('/menu', payload);
      set((state) => ({ dbMenu: [data, ...state.dbMenu], menuLoading: false }));
      return data;
    } catch (err) {
      set({ menuError: err.response?.data?.error ?? err.message, menuLoading: false });
      return null;
    }
  },

  /**
   * updateMenuItem(id, patch)
   * patch can be any subset: { price, inStock, name, … }
   */
  updateMenuItem: async (id, patch) => {
    try {
      const { data } = await API.put(`/menu/${id}`, patch);
      set((state) => ({
        dbMenu: state.dbMenu.map((item) => (item._id === id ? data : item)),
      }));
      return data;
    } catch (err) {
      set({ menuError: err.response?.data?.error ?? err.message });
      return null;
    }
  },

  deleteMenuItem: async (id) => {
    try {
      await API.delete(`/menu/${id}`);
      set((state) => ({ dbMenu: state.dbMenu.filter((item) => item._id !== id) }));
      return true;
    } catch (err) {
      set({ menuError: err.response?.data?.error ?? err.message });
      return false;
    }
  },

  // ─────────────────────────────────────────────
  // DB-backed Stories (Admin Panel)
  // ─────────────────────────────────────────────
  stories: [],
  storiesLoading: false,
  storiesError: null,

  fetchStories: async () => {
    set({ storiesLoading: true, storiesError: null });
    try {
      const { data } = await API.get('/stories');
      set({ stories: data, storiesLoading: false });
    } catch (err) {
      set({ storiesError: err.response?.data?.error ?? err.message, storiesLoading: false });
    }
  },

  /**
   * createStory({ title, imageFile })
   * Converts imageFile to Base64 before POSTing.
   */
  createStory: async ({ title, imageFile }) => {
    set({ storiesLoading: true, storiesError: null });
    try {
      const imageUrl = imageFile ? await toBase64(imageFile) : '';
      const { data } = await API.post('/stories', { title, imageUrl, isActive: true });
      set((state) => ({ stories: [data, ...state.stories], storiesLoading: false }));
      return data;
    } catch (err) {
      set({ storiesError: err.response?.data?.error ?? err.message, storiesLoading: false });
      return null;
    }
  },

  updateStory: async (id, patch) => {
    try {
      const { data } = await API.put(`/stories/${id}`, patch);
      set((state) => ({
        stories: state.stories.map((s) => (s._id === id ? data : s)),
      }));
      return data;
    } catch (err) {
      set({ storiesError: err.response?.data?.error ?? err.message });
      return null;
    }
  },

  deleteStory: async (id) => {
    try {
      await API.delete(`/stories/${id}`);
      set((state) => ({ stories: state.stories.filter((s) => s._id !== id) }));
      return true;
    } catch (err) {
      set({ storiesError: err.response?.data?.error ?? err.message });
      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Users
  // ─────────────────────────────────────────────
  users: initialUsers,

  // ─────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────
  auth: { role: null, customerName: '', tableNumber: null },
  currentUser: null,

  loginAdmin: () =>
    set({ auth: { role: 'Admin', customerName: '', tableNumber: null } }),

  logoutAdmin: () =>
    set({ auth: { role: null, customerName: '', tableNumber: null }, currentUser: null }),

  loginCustomer: (email, password) => {
    const { users } = get();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return null;
    set({
      auth: { role: 'Customer', customerName: user.name, tableNumber: null },
      currentUser: user,
    });
    return user;
  },

  signupCustomer: (name, email, password) => {
    const { users } = get();
    if (users.find((u) => u.email === email)) return null;
    const newUser = { name, email, password, profile: createUserProfile() };
    set((state) => ({
      users: [...state.users, newUser],
      auth: { role: 'Customer', customerName: name, tableNumber: null },
      currentUser: newUser,
    }));
    return newUser;
  },

  updateCurrentUserProfile: (updates) =>
    set((state) => {
      if (!state.currentUser) return state;
      const { profile: profilePatch = {}, ...userPatch } = updates;
      const mergedProfile = {
        ...state.currentUser.profile,
        ...profilePatch,
        preferences: {
          ...state.currentUser.profile?.preferences,
          ...profilePatch.preferences,
        },
      };
      const updatedUser = {
        ...state.currentUser,
        ...userPatch,
        profile: mergedProfile,
      };
      return {
        currentUser: updatedUser,
        auth: { ...state.auth, customerName: updatedUser.name },
        users: state.users.map((user) =>
          user.email === state.currentUser.email ? updatedUser : user
        ),
      };
    }),

  logoutCustomer: () =>
    set({ auth: { role: null, customerName: '', tableNumber: null }, currentUser: null, cart: [] }),

  setTable: (tableNumber) =>
    set((state) => ({ auth: { ...state.auth, tableNumber } })),

  // ─────────────────────────────────────────────
  // Cart
  // ─────────────────────────────────────────────
  cart: [],
  collaborativeMode: false,


  addToCart: (menuItem) =>
  set((state) => {
    const itemId = menuItem._id || menuItem.id;
    const existing = state.cart.find((c) => (c._id || c.id) === itemId);
    if (existing) {
      return {
        cart: state.cart.map((c) =>
          (c._id || c.id) === itemId ? { ...c, qty: c.qty + 1 } : c
        ),
      };
    }
    return { cart: [...state.cart, { ...menuItem, qty: 1 }] };
  }),

removeFromCart: (id) =>
  set((state) => {
    const existing = state.cart.find((c) => (c._id || c.id) === id);
    if (existing && existing.qty > 1) {
      return {
        cart: state.cart.map((c) =>
          (c._id || c.id) === id ? { ...c, qty: c.qty - 1 } : c
        ),
      };
    }
    return { cart: state.cart.filter((c) => (c._id || c.id) !== id) };
  }),

  clearCart: () => set({ cart: [] }),

  setCollaborativeMode: (enabled) => set({ collaborativeMode: Boolean(enabled) }),

  mergeRemoteCartItems: (remoteItems) =>
    set((state) => ({ cart: mergeCartWithDeltas(state.cart, remoteItems) })),

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.qty, 0);
  },

  // ─────────────────────────────────────────────
  // Orders
  // ─────────────────────────────────────────────
  orders: [],

  placeOrder: () => {
    const { cart, auth, getCartTotal } = get();
    if (cart.length === 0) return;
    const newOrder = {
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
      tableNumber: auth.tableNumber,
      customerName: auth.customerName,
      items: [...cart],
      totalAmount: getCartTotal(),
      status: 'New',
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ orders: [newOrder, ...state.orders], cart: [] }));
    return newOrder;
  },

  updateOrderStatus: (orderId, newStatus) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.orderId === orderId ? { ...o, status: newStatus } : o
      ),
    })),
}));

export default useStore;
