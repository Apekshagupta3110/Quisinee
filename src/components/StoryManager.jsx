import { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore';

// ─── Toggle ──────────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    aria-pressed={checked}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none
      ${checked ? 'bg-[#8BA888]' : 'bg-[#2B2D42]/20'}
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200
      ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

// ─── Upload Form ─────────────────────────────────────────────────────────────

function UploadStoryForm({ onAdd, loading }) {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Please enter a story title.'); return; }
    if (!imageFile) { setError('Please select an image.'); return; }
    setError('');
    const ok = await onAdd({ title: title.trim(), imageFile });
    if (ok) {
      setTitle('');
      setImageFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#F9F8F6] rounded-2xl border border-[#2B2D42]/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#2B2D42] px-6 py-4">
        <h2 className="font-serif text-xl text-[#F9F8F6] tracking-wide">Upload New Story</h2>
        <p className="text-[#F9F8F6]/50 text-xs mt-0.5">Stories appear in the app's Insta-style strip at the top</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="relative aspect-[9/16] max-h-72 w-full rounded-2xl border-2 border-dashed
            border-[#2B2D42]/20 bg-[#2B2D42]/5 overflow-hidden cursor-pointer
            hover:border-[#8BA888] hover:bg-[#8BA888]/5 transition-all duration-200"
        >
          {preview
            ? <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
            : <div className="absolute inset-0 flex flex-col items-center justify-center text-[#2B2D42]/30 select-none">
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-[#2B2D42]/40">Drop image here</p>
                <p className="text-xs mt-1">or click to browse</p>
                <p className="text-[10px] mt-3 text-[#2B2D42]/25">9:16 ratio recommended</p>
              </div>
          }
          {/* Overlay on hover when image loaded */}
          {preview && (
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity
              flex items-center justify-center">
              <p className="text-white text-sm font-medium">Change Image</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {/* Right column */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#2B2D42]/60 mb-1.5 uppercase tracking-wider">
              Story Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Weekend Specials 🌟"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#2B2D42]/15 focus:border-[#8BA888]
                text-sm bg-white text-[#2B2D42] placeholder:text-[#2B2D42]/30 outline-none transition-colors"
            />
          </div>

          {/* Tips */}
          <div className="bg-[#8BA888]/10 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-[#8BA888] uppercase tracking-wider">Tips</p>
            <ul className="text-xs text-[#2B2D42]/60 space-y-1.5">
              <li className="flex gap-2"><span>📐</span><span>Use 9:16 portrait images for best display</span></li>
              <li className="flex gap-2"><span>🖼️</span><span>Images are stored as Base64 in MongoDB</span></li>
              <li className="flex gap-2"><span>⚡</span><span>Keep images under 2 MB for fast load</span></li>
              <li className="flex gap-2"><span>🎛️</span><span>Toggle active/inactive without deleting</span></li>
            </ul>
          </div>

          {error && (
            <p className="text-sm text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-[#8BA888] hover:bg-[#7a9877] active:scale-95
              text-white text-sm font-semibold tracking-wide transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Uploading…</>
              : <>↑ Publish Story</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Story Card ───────────────────────────────────────────────────────────────

function StoryCard({ story, onUpdate, onDelete }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleActive = async () => {
    setSaving(true);
    await onUpdate(story._id, { isActive: !story.isActive });
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete story "${story.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await onDelete(story._id);
  };

  const relativeTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className={`group relative rounded-2xl overflow-hidden shadow-sm border transition-all duration-200
      hover:shadow-lg hover:-translate-y-0.5
      ${story.isActive ? 'border-[#8BA888]/40' : 'border-[#2B2D42]/10 opacity-60'}`}
      style={{ aspectRatio: '9/16' }}
    >
      {/* Background image */}
      {story.imageUrl
        ? <img src={story.imageUrl} alt={story.title}
            className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0 bg-gradient-to-br from-[#2B2D42] to-[#8BA888]/50" />
      }

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

      {/* Active indicator ring */}
      {story.isActive && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-[#8BA888] pointer-events-none" />
      )}

      {/* Inactive overlay */}
      {!story.isActive && (
        <div className="absolute top-3 right-3">
          <span className="bg-[#2B2D42]/80 text-[#F9F8F6] text-[9px] font-bold px-2 py-0.5 rounded-full
            tracking-widest uppercase">Inactive</span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-3">
        <div>
          <p className="text-white font-serif text-sm font-semibold leading-snug line-clamp-2">{story.title}</p>
          {story.createdAt && (
            <p className="text-white/50 text-[10px] mt-0.5">{relativeTime(story.createdAt)}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Toggle checked={story.isActive} onChange={handleToggleActive} disabled={saving} />
            <span className="text-white/70 text-[10px] leading-none">
              {story.isActive ? 'Live' : 'Off'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg bg-[#E07A5F]/80 hover:bg-[#E07A5F] text-white
              transition-colors duration-150 disabled:opacity-50"
            title="Delete story"
          >
            {deleting
              ? <span className="block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoryManager() {
  const {
    stories, storiesLoading, storiesError,
    fetchStories, createStory, updateStory, deleteStory,
  } = useStore();

  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  useEffect(() => { fetchStories(); }, []);

  const displayed = stories.filter((s) => {
    if (filter === 'active') return s.isActive;
    if (filter === 'inactive') return !s.isActive;
    return true;
  });

  const activeCount = stories.filter((s) => s.isActive).length;

  const handleAdd = async (fields) => {
    const result = await createStory(fields);
    return !!result;
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-[#2B2D42] tracking-tight">Story Manager</h1>
            <p className="text-[#2B2D42]/50 text-sm mt-1">
              <span className="font-semibold text-[#8BA888]">{activeCount}</span> active
              {' '}· {stories.length} total
            </p>
          </div>
          {storiesError && (
            <div className="text-sm text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-2 rounded-xl max-w-xs text-right">
              {storiesError}
            </div>
          )}
        </div>

        {/* Upload form */}
        <UploadStoryForm onAdd={handleAdd} loading={storiesLoading} />

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: `All (${stories.length})` },
            { key: 'active', label: `Live (${activeCount})` },
            { key: 'inactive', label: `Inactive (${stories.length - activeCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150
                ${filter === key
                  ? 'bg-[#2B2D42] text-[#F9F8F6]'
                  : 'bg-white border border-[#2B2D42]/15 text-[#2B2D42]/60 hover:border-[#2B2D42]/40'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stories grid — portrait cards like a real Stories strip */}
        {storiesLoading && stories.length === 0 ? (
          <div className="text-center py-20 text-[#2B2D42]/40 text-sm">Loading stories…</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-[#2B2D42]/40 text-sm">
            {stories.length === 0
              ? 'No stories yet — upload your first one above.'
              : 'No stories match this filter.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {displayed.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                onUpdate={updateStory}
                onDelete={deleteStory}
              />
            ))}
          </div>
        )}

        {/* Empty state hint when all are inactive */}
        {stories.length > 0 && activeCount === 0 && (
          <div className="bg-[#E07A5F]/10 border border-[#E07A5F]/20 rounded-2xl px-5 py-4 text-sm text-[#E07A5F]">
            ⚠️ All stories are currently inactive and won't appear for customers. Toggle at least one to <strong>Live</strong>.
          </div>
        )}
      </div>
    </div>
  );
}
