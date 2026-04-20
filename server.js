import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const app = express();
app.use(express.json({ limit: '20mb' })); // Allow large Base64 payloads

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://quisine-app.vercel.app'
  ],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quisine');

// ─────────────────────────────────────────────
// Schemas & Models
// ─────────────────────────────────────────────

const menuItemSchema = new mongoose.Schema(
  {
    name:        { type: String,  required: true },
    price:       { type: Number,  required: true },
    category:    { type: String,  required: true },
    description: { type: String,  default: '' },
    image:       { type: String,  default: '' }, // Base64 data-URL string
    inStock:     { type: Boolean, default: true },
    isChefSpecial: { type: Boolean, default: false },
    tasteTags:   [{ type: String }],
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

const storySchema = new mongoose.Schema(
  {
    imageUrl: { type: String,  required: true }, // Base64 data-URL string
    title:    { type: String,  required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Story = mongoose.model('Story', storySchema);

// ── NEW: Customer schema ──
const customerSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profile: {
      phone:                  { type: String, default: '' },
      avatarUrl:              { type: String, default: '' },
      bio:                    { type: String, default: '' },
      dateOfBirth:            { type: String, default: '' },
      emergencyContactName:   { type: String, default: '' },
      emergencyContactPhone:  { type: String, default: '' },
      preferences: {
        spiceLevel:           { type: String, default: 'Medium' },
        dietaryPreferences:   [{ type: String }],
        favoriteCuisine:      { type: String, default: '' },
        newsletterOptIn:      { type: Boolean, default: false },
      },
      addresses: [
        {
          label:      { type: String, default: 'Primary' },
          line1:      { type: String, default: '' },
          line2:      { type: String, default: '' },
          city:       { type: String, default: '' },
          state:      { type: String, default: '' },
          postalCode: { type: String, default: '' },
          country:    { type: String, default: 'India' },
          isPrimary:  { type: Boolean, default: true },
        },
      ],
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

// ── NEW: Order schema ──
const orderSchema = new mongoose.Schema(
  {
    orderId:      { type: String, default: () => `ORD-${Date.now().toString(36).toUpperCase()}` },
    tableNumber:  { type: Number },
    customerName: { type: String },
    items: [
      {
        id:    { type: String },
        name:  { type: String },
        qty:   { type: Number },
        price: { type: Number },
        image: { type: String, default: '' },
      },
    ],
    totalAmount: { type: Number, required: true },
    status:      { type: String, default: 'New', enum: ['New', 'Preparing', 'Served'] },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

// ─────────────────────────────────────────────
// Menu Routes
// ─────────────────────────────────────────────

// GET all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a menu item
app.post('/api/menu', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update a menu item (price, inStock, or any field)
app.put('/api/menu/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────
// Story Routes
// ─────────────────────────────────────────────

// GET all stories (optionally filter active only via ?active=true)
app.get('/api/stories', async (req, res) => {
  try {
    const filter = req.query.active === 'true' ? { isActive: true } : {};
    const stories = await Story.find(filter).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a story
app.post('/api/stories', async (req, res) => {
  try {
    const story = new Story(req.body);
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update a story (toggle isActive, change title, etc.)
app.put('/api/stories/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a story
app.delete('/api/stories/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────
// Customer Routes (NEW)
// ─────────────────────────────────────────────

// POST signup — create a new customer
app.post('/api/customers/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const customer = new Customer({ name, email, passwordHash });
    await customer.save();
    // Return the customer without the password hash
    res.status(201).json({ _id: customer._id, name: customer.name, email: customer.email, profile: customer.profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST login — verify credentials
app.post('/api/customers/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Return the customer without the password hash
    res.json({ _id: customer._id, name: customer.name, email: customer.email, profile: customer.profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update customer profile
app.put('/api/customers/:id/profile', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { profile: req.body.profile },
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ _id: customer._id, name: customer.name, email: customer.email, profile: customer.profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────
// Order Routes (NEW)
// ─────────────────────────────────────────────

// GET all orders — used by AdminDashboard
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST place a new order — called when customer clicks "Place Order"
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH update order status — called by admin Kanban board
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Quisine server running on port ${PORT}`);
});
