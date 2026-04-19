import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UserRound } from 'lucide-react';
import useStore from '../store/useStore';
import './UserProfile.css';

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Jain', 'Gluten-Free', 'High Protein'];

const SPICE_LEVELS = ['Mild', 'Medium', 'Hot'];

export default function UserProfile() {
  const navigate = useNavigate();
  const auth = useStore((s) => s.auth);
  const currentUser = useStore((s) => s.currentUser);
  const orders = useStore((s) => s.orders);
  const cartCount = useStore((s) => s.cart.reduce((sum, item) => sum + item.qty, 0));
  const updateCurrentUserProfile = useStore((s) => s.updateCurrentUserProfile);

  const [savedAt, setSavedAt] = useState(null);

  const profile = currentUser?.profile || {};
  const primaryAddress = profile.addresses?.[0] || {};
  const preferences = profile.preferences || {};
  const userOrderCount = currentUser
    ? orders.filter((order) => order.customerName === currentUser.name).length
    : 0;

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: profile.phone || '',
    avatarUrl: profile.avatarUrl || '',
    bio: profile.bio || '',
    dateOfBirth: profile.dateOfBirth || '',
    emergencyContactName: profile.emergencyContactName || '',
    emergencyContactPhone: profile.emergencyContactPhone || '',
    favoriteCuisine: preferences.favoriteCuisine || '',
    spiceLevel: preferences.spiceLevel || 'Medium',
    newsletterOptIn: Boolean(preferences.newsletterOptIn),
    dietaryPreferences: preferences.dietaryPreferences || [],
    addressLabel: primaryAddress.label || 'Primary',
    line1: primaryAddress.line1 || '',
    line2: primaryAddress.line2 || '',
    city: primaryAddress.city || '',
    state: primaryAddress.state || '',
    postalCode: primaryAddress.postalCode || '',
    country: primaryAddress.country || 'India',
  });

  if (auth.role !== 'Customer' || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const initials = useMemo(
    () =>
      form.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join('') || 'U',
    [form.name]
  );

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDietaryOption = (option) => {
    setForm((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(option)
        ? prev.dietaryPreferences.filter((item) => item !== option)
        : [...prev.dietaryPreferences, option],
    }));
  };

  const saveProfile = () => {
    updateCurrentUserProfile({
      name: form.name.trim(),
      profile: {
        phone: form.phone.trim(),
        avatarUrl: form.avatarUrl.trim(),
        bio: form.bio.trim(),
        dateOfBirth: form.dateOfBirth,
        emergencyContactName: form.emergencyContactName.trim(),
        emergencyContactPhone: form.emergencyContactPhone.trim(),
        preferences: {
          favoriteCuisine: form.favoriteCuisine.trim(),
          spiceLevel: form.spiceLevel,
          dietaryPreferences: form.dietaryPreferences,
          newsletterOptIn: form.newsletterOptIn,
        },
        addresses: [
          {
            label: form.addressLabel.trim() || 'Primary',
            line1: form.line1.trim(),
            line2: form.line2.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            postalCode: form.postalCode.trim(),
            country: form.country.trim() || 'India',
            isPrimary: true,
          },
        ],
      },
    });
    setSavedAt(new Date().toLocaleTimeString());
  };

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <section className="profile-card">
          <div className="profile-header">
            <div>
              <h1 className="profile-title">User Profile</h1>
              <p className="profile-subtitle">Manage your dining preferences and contact details</p>
            </div>
            <div className="profile-actions">
              <button type="button" className="profile-btn secondary" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
              </button>
              <button type="button" className="profile-btn primary" onClick={saveProfile}>
                <Save size={14} />
                {' '}
                Save Profile
              </button>
            </div>
          </div>
          <div className="profile-content">
            <div className="profile-top">
              <div className="profile-avatar-box">
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Profile avatar" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar-fallback">{initials}</div>
                )}
                <div>
                  <strong>{form.name || 'Guest User'}</strong>
                  <p className="profile-subtitle">{form.email}</p>
                </div>
              </div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <span>Orders</span>
                  <strong>{userOrderCount}</strong>
                </div>
                <div className="profile-stat">
                  <span>Cart Items</span>
                  <strong>{cartCount}</strong>
                </div>
                <div className="profile-stat">
                  <span>Status</span>
                  <strong>Active</strong>
                </div>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="name">Full Name</label>
                <input id="name" value={form.name} onChange={(e) => handleField('name', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="email">Email</label>
                <input id="email" value={form.email} disabled />
              </div>
              <div className="profile-field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" value={form.phone} onChange={(e) => handleField('phone', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="dob">Date of Birth</label>
                <input id="dob" type="date" value={form.dateOfBirth} onChange={(e) => handleField('dateOfBirth', e.target.value)} />
              </div>
              <div className="profile-field full">
                <label htmlFor="avatar">Avatar URL</label>
                <input id="avatar" value={form.avatarUrl} onChange={(e) => handleField('avatarUrl', e.target.value)} placeholder="https://example.com/avatar.png" />
              </div>
              <div className="profile-field full">
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" value={form.bio} onChange={(e) => handleField('bio', e.target.value)} placeholder="Share your food style or dining preferences" />
              </div>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-content">
            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="favoriteCuisine">Favorite Cuisine</label>
                <input id="favoriteCuisine" value={form.favoriteCuisine} onChange={(e) => handleField('favoriteCuisine', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="spiceLevel">Preferred Spice Level</label>
                <select id="spiceLevel" value={form.spiceLevel} onChange={(e) => handleField('spiceLevel', e.target.value)}>
                  {SPICE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="profile-field full">
                <label>Dietary Preferences</label>
                <div className="profile-pill-row">
                  {DIETARY_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={`profile-pill ${form.dietaryPreferences.includes(option) ? 'active' : ''}`}
                      onClick={() => toggleDietaryOption(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="profile-field full">
                <label htmlFor="newsletter">Newsletter</label>
                <select
                  id="newsletter"
                  value={form.newsletterOptIn ? 'yes' : 'no'}
                  onChange={(e) => handleField('newsletterOptIn', e.target.value === 'yes')}
                >
                  <option value="yes">Subscribed</option>
                  <option value="no">Not Subscribed</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <div className="profile-content">
            <h2 className="profile-title" style={{ fontSize: '1rem' }}>
              Delivery Address & Emergency Contact
            </h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label htmlFor="addressLabel">Address Label</label>
                <input id="addressLabel" value={form.addressLabel} onChange={(e) => handleField('addressLabel', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="line1">Address Line 1</label>
                <input id="line1" value={form.line1} onChange={(e) => handleField('line1', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="line2">Address Line 2</label>
                <input id="line2" value={form.line2} onChange={(e) => handleField('line2', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="city">City</label>
                <input id="city" value={form.city} onChange={(e) => handleField('city', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="state">State</label>
                <input id="state" value={form.state} onChange={(e) => handleField('state', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="postalCode">Postal Code</label>
                <input id="postalCode" value={form.postalCode} onChange={(e) => handleField('postalCode', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="country">Country</label>
                <input id="country" value={form.country} onChange={(e) => handleField('country', e.target.value)} />
              </div>
              <div className="profile-field">
                <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                <input
                  id="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={(e) => handleField('emergencyContactName', e.target.value)}
                />
              </div>
              <div className="profile-field">
                <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                <input
                  id="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={(e) => handleField('emergencyContactPhone', e.target.value)}
                />
              </div>
            </div>

            <p className="profile-note">
              {savedAt ? `Last saved at ${savedAt}` : 'No local edits saved in this session yet.'}
            </p>
          </div>
        </section>
      </div>
      <button
        type="button"
        onClick={() => navigate('/menu/' + (auth.tableNumber || 1))}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          border: 0,
          width: 48,
          height: 48,
          borderRadius: 999,
          background: '#2B2D42',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 10px 20px rgba(43, 45, 66, 0.22)',
        }}
        title="Back to menu"
      >
        <UserRound size={18} />
      </button>
    </div>
  );
}
