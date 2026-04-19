import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json({ limit: '20mb' })); // Allow large Base64 payloads

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://quisine-app.vercel.app'  // ← replace with your actual Vercel URL
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
// Start
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Quisine server running on port ${PORT}`);
});
