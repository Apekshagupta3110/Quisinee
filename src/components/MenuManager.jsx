import { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore';

// ─── Tiny helpers ────────────────────────────────────────────────────────────

const CATEGORIES = ['Starters', 'Main Course', 'Beverages & Desserts', 'Specials'];

const TASTE_OPTIONS = [
  'Crispy', 'Spicy', 'Smoky', 'Sweet', 'Savory',
  'Creamy', 'Rich', 'Warm', 'Cold', 'Protein',
  'Comfort', 'Healthy', 'Traditional', 'Premium',
];

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    aria-pressed={checked}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none
      ${checked ? 'bg-[#8BA888]' : 'bg-[#2B2D42]/20'}
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200
        ${checked ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);

const Badge = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xs px-2 py-0.5 rounded-full border transition-all duration-150
      ${active
        ? 'bg-[#2B2D42] text-[#F9F8F6] border-[#2B2D42]'
        : 'bg-transparent text-[#2B2D42]/60 border-[#2B2D42]/25 hover:border-[#2B2D42]/60'}`}
  >
    {label}
  </button>
);

// ─── Add-Item Form ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  price: '',
  category: CATEGORIES[0],
  description: '',
  isChefSpecial: false,
  tasteTags: [],
  imageFile: null,
  imagePreview: null,
};

function AddMenuItemForm({ onAdd, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set('imageFile', file);
    const reader = new FileReader();
    reader.onload = () => set('imagePreview', reader.result);
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      tasteTags: f.tasteTags.includes(tag)
        ? f.tasteTags.filter((t) => t !== tag)
        : [...f.tasteTags, tag],
    }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Enter a valid price';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    const ok = await onAdd(form);
    if (ok) {
      setForm(EMPTY_FORM);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#F9F8F6] rounded-2xl border border-[#2B2D42]/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#2B2D42] px-6 py-4">
        <h2 className="font-serif text-xl text-[#F9F8F6] tracking-wide">Add New Dish</h2>
        <p className="text-[#F9F8F6]/50 text-xs mt-0.5">Fill in the details below to publish a new item</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Image upload */}
        <div className="md:col-span-2 flex gap-4 items-start">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-[#2B2D42]/25
              bg-[#2B2D42]/5 overflow-hidden cursor-pointer hover:border-[#8BA888] transition-colors"
          >
            {form.imagePreview
              ? <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
              : <span className="absolute inset-0 flex flex-col items-center justify-center text-[#2B2D42]/30 text-xs select-none">
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload
                </span>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          <div className="flex-1 text-sm text-[#2B2D42]/50 pt-2">
            <p className="font-medium text-[#2B2D42]/70 mb-1">Dish Photo</p>
            <p>Click the box to upload. JPG, PNG, WebP accepted. Stored as Base64.</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#2B2D42]/60 mb-1.5 uppercase tracking-wider">
            Dish Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Smoked Paneer Tikka"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-[#2B2D42]
              placeholder:text-[#2B2D42]/30 outline-none transition-colors
              ${errors.name ? 'border-[#E07A5F] focus:border-[#E07A5F]' : 'border-[#2B2D42]/15 focus:border-[#8BA888]'}`}
          />
          {errors.name && <p className="text-[#E07A5F] text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold text-[#2B2D42]/60 mb-1.5 uppercase tracking-wider">
            Price (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2B2D42]/40 text-sm font-medium">₹</span>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="199"
              className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm bg-white text-[#2B2D42]
                placeholder:text-[#2B2D42]/30 outline-none transition-colors
                ${errors.price ? 'border-[#E07A5F]' : 'border-[#2B2D42]/15 focus:border-[#8BA888]'}`}
            />
          </div>
          {errors.price && <p className="text-[#E07A5F] text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[#2B2D42]/60 mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#2B2D42]/15 focus:border-[#8BA888]
              text-sm bg-white text-[#2B2D42] outline-none transition-colors appearance-none cursor-pointer"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Chef's Special toggle */}
        <div className="flex items-center gap-3 pt-2">
          <Toggle
            checked={form.isChefSpecial}
            onChange={(v) => set('isChefSpecial', v)}
          />
          <div>
            <p className="text-sm font-medium text-[#2B2D42]">Chef's Special</p>
            <p className="text-xs text-[#2B2D42]/50">Highlights this dish with a star badge</p>
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#2B2D42]/60 mb-1.5 uppercase tracking-wider">
            Description
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="A short, enticing description of the dish..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#2B2D42]/15 focus:border-[#8BA888]
              text-sm bg-white text-[#2B2D42] placeholder:text-[#2B2D42]/30 outline-none transition-colors resize-none"
          />
        </div>

        {/* Taste Tags */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#2B2D42]/60 mb-2 uppercase tracking-wider">
            Taste Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {TASTE_OPTIONS.map((tag) => (
              <Badge
                key={tag}
                label={tag}
                active={form.tasteTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#8BA888] hover:bg-[#7a9877] active:scale-95
              text-white text-sm font-semibold tracking-wide transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
              : <>+ Add to Menu</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Menu Item Card ──────────────────────────────────────────────────────────

function MenuItemCard({ item, onUpdate, onDelete }) {
  const [price, setPrice] = useState(String(item.price));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePriceBlur = async () => {
    const newPrice = Number(price);
    if (!isNaN(newPrice) && newPrice > 0 && newPrice !== item.price) {
      setSaving(true);
      await onUpdate(item._id, { price: newPrice });
      setSaving(false);
    } else {
      setPrice(String(item.price));
    }
  };


const handleToggleStock = async (newValue) => {
  setSaving(true);
  await onUpdate(item._id, { inStock: newValue });
  setSaving(false);
};

  const handleDelete = async () => {
    if (!window.confirm(`Remove "${item.name}" from the menu?`)) return;
    setDeleting(true);
    await onDelete(item._id);
    // component unmounts on success
  };

  return (
    <div className={`group relative bg-[#F9F8F6] rounded-2xl border overflow-hidden shadow-sm
      transition-all duration-200 hover:shadow-md
      ${!item.inStock ? 'border-[#E07A5F]/30 opacity-75' : 'border-[#2B2D42]/10'}`}
    >
      {/* Image */}
      <div className="relative h-36 bg-[#2B2D42]/5 overflow-hidden">
        {item.image
          ? <img src={item.image} alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-[#2B2D42]/20">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
        {/* Chef special badge */}
        {item.isChefSpecial && (
          <span className="absolute top-2 left-2 bg-[#2B2D42] text-[#F9F8F6] text-[10px]
            font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
            ★ Chef's Special
          </span>
        )}
        {/* Out of stock overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-[#2B2D42]/50 flex items-center justify-center">
            <span className="text-[#F9F8F6] text-xs font-bold tracking-widest uppercase bg-[#E07A5F]
              px-3 py-1 rounded-full">Sold Out</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <p className="font-serif font-semibold text-[#2B2D42] text-sm leading-snug line-clamp-1">{item.name}</p>
          <p className="text-[10px] text-[#2B2D42]/40 mt-0.5 uppercase tracking-wider">{item.category}</p>
        </div>

        {item.description && (
          <p className="text-xs text-[#2B2D42]/55 line-clamp-2 leading-relaxed">{item.description}</p>
        )}

        {/* Taste tags */}
        {item.tasteTags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tasteTags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#8BA888]/15
                text-[#8BA888] font-medium uppercase tracking-wider">{tag}</span>
            ))}
          </div>
        )}

        {/* Price editor */}
        <div className="flex items-center gap-2">
          <span className="text-[#2B2D42]/40 text-sm">₹</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handlePriceBlur}
            className="w-full px-2 py-1 rounded-lg border border-[#2B2D42]/15 focus:border-[#8BA888]
              text-sm font-semibold text-[#2B2D42] bg-white outline-none transition-colors"
          />
          {saving && <span className="w-3 h-3 border border-[#8BA888] border-t-transparent rounded-full animate-spin flex-shrink-0" />}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-[#2B2D42]/8">
          <div className="flex items-center gap-2">
            <Toggle checked={item.inStock} onChange={handleToggleStock} disabled={saving} />
            <span className="text-xs text-[#2B2D42]/60">
              {item.inStock ? 'In Stock' : 'Sold Out'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1 text-xs text-[#E07A5F] hover:text-white
              hover:bg-[#E07A5F] px-2.5 py-1 rounded-lg transition-all duration-150
              disabled:opacity-50"
          >
            {deleting
              ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            }
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MenuManager() {
  const {
    dbMenu, menuLoading, menuError,
    fetchMenu, createMenuItem, updateMenuItem, deleteMenuItem,
  } = useStore();

  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchMenu(); }, []);

  const filtered = dbMenu
    .filter((item) => filterCategory === 'All' || item.category === filterCategory)
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async (form) => {
    const result = await createMenuItem(form);
    return !!result;
  };

  return (
   <div className="bg-[#F9F8F6] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[#2B2D42] tracking-tight">Menu Manager</h1>
            <p className="text-[#2B2D42]/50 text-sm mt-1">
              {dbMenu.length} {dbMenu.length === 1 ? 'dish' : 'dishes'} in the database
            </p>
          </div>
          {menuError && (
            <div className="text-sm text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-2 rounded-xl max-w-xs text-right">
              {menuError}
            </div>
          )}
        </div>

        {/* Add form */}
        <AddMenuItemForm onAdd={handleAdd} loading={menuLoading} />

        {/* Filter / Search bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B2D42]/30"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2B2D42]/15
                focus:border-[#8BA888] bg-white text-sm text-[#2B2D42] outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150
                  ${filterCategory === cat
                    ? 'bg-[#2B2D42] text-[#F9F8F6]'
                    : 'bg-white border border-[#2B2D42]/15 text-[#2B2D42]/60 hover:border-[#2B2D42]/40'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {menuLoading && dbMenu.length === 0 ? (
          <div className="text-center py-20 text-[#2B2D42]/40 text-sm">Loading menu…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#2B2D42]/40 text-sm">
            {dbMenu.length === 0 ? 'No dishes yet — add your first one above.' : 'No dishes match your filter.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onUpdate={updateMenuItem}
                onDelete={deleteMenuItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
