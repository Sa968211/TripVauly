import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Star, Edit2, Trash2, X, Globe, Award, Sparkles, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';

function Dashboard({ user, token }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [verifyingLocation, setVerifyingLocation] = useState(false);
  
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    rating: 5
  });

  const authToken = token || localStorage.getItem('token');

  useEffect(() => {
    fetchTrips();
  }, [authToken]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/trips', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTrips(data.data);
      } else {
        setError(data.message || 'Failed to load trips');
      }
    } catch (err) {
      setError('Cannot connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationChange = async (value) => {
    setFormData(prev => ({ ...prev, destination: value }));
    setValidationError('');

    if (value.trim().length >= 3) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value.trim())}&limit=5`);
        const data = await res.json();
        const names = data.map(item => item.display_name);
        setLocationSuggestions(names);
      } catch (err) {
        // Fallback silently
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTripId(null);
    setValidationError('');
    setFormData({
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      description: '',
      rating: 5
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (trip) => {
    setEditingTripId(trip._id);
    setValidationError('');
    setFormData({
      title: trip.title || '',
      destination: trip.destination || '',
      startDate: trip.startDate ? trip.startDate.split('T')[0] : '',
      endDate: trip.endDate ? trip.endDate.split('T')[0] : '',
      description: trip.description || '',
      rating: trip.rating || 5
    });
    setShowModal(true);
  };

  // STRICT VALIDATOR: Rejects "asasasa", "aaa", "aaaa", "xyz", "asdf"
  const validateField = (text, fieldName) => {
    const clean = text.trim().toLowerCase();

    if (clean.length < 3) {
      return `${fieldName} must be at least 3 characters long.`;
    }

    // 1. Check for repeated 2-letter loops (e.g. asasasa, adadad, qwqwqw)
    const isRepeatedLoop = /(..)\1{2,}/.test(clean);
    // 2. Check for repeated single characters (e.g. aaa, aaaa, bbb)
    const isSingleCharRepeat = /(.)\1{2,}/.test(clean);
    // 3. Known gibberish patterns
    const mashPatterns = ['asdf', 'qwer', 'zxcv', 'xyz', 'gaga', 'caxa', 'test', 'abcd', '1234', 'qwerty'];
    const isMash = mashPatterns.some(p => clean.includes(p));

    if (isRepeatedLoop || isSingleCharRepeat || isMash) {
      return `Invalid ${fieldName}! "${text}" is generic input. Please enter a real ${fieldName.toLowerCase()}.`;
    }

    return null;
  };

  // Verify location on Map API
  const verifyRealPlaceOnEarth = async (placeName) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName.trim())}&limit=1`);
      const data = await res.json();
      return data && data.length > 0;
    } catch (err) {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationError('');

    // 1. Validate Destination Text
    const destErr = validateField(formData.destination, 'Destination');
    if (destErr) {
      setValidationError(destErr);
      return;
    }

    // 2. Validate Title Text
    const titleErr = validateField(formData.title, 'Trip Title');
    if (titleErr) {
      setValidationError(titleErr);
      return;
    }

    // 3. Validate Description Text (if filled)
    if (formData.description.trim().length > 0) {
      const descErr = validateField(formData.description, 'Description');
      if (descErr) {
        setValidationError(descErr);
        return;
      }
    }

    // 4. API Location Check
    setVerifyingLocation(true);
    const placeExists = await verifyRealPlaceOnEarth(formData.destination);
    setVerifyingLocation(false);

    if (!placeExists) {
      setValidationError(`"${formData.destination}" was not recognized as a real place on Earth.`);
      return;
    }

    const url = editingTripId
      ? `http://localhost:5000/api/trips/${editingTripId}`
      : 'http://localhost:5000/api/trips';

    const method = editingTripId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        fetchTrips();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save trip.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await res.json();
      if (data.success) {
        fetchTrips();
      } else {
        alert(data.message || 'Could not delete trip');
      }
    } catch (err) {
      alert('Error deleting trip');
    }
  };

  const totalTrips = trips.length;
  const avgRating = totalTrips > 0 ? (trips.reduce((acc, t) => acc + (t.rating || 0), 0) / totalTrips).toFixed(1) : '0.0';
  const uniqueDestinations = new Set(trips.map(t => t.destination.toLowerCase().trim())).size;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* HERO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '24px',
          padding: '36px',
          color: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
              <UserCheck size={16} /> Logged in as {user?.email || 'Explorer'}
            </div>
            <h1 style={{ margin: 0, fontSize: '34px', fontWeight: '800' }}>
              Welcome back, {user?.name || 'Traveler'}! 👋
            </h1>
            <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '16px' }}>
              Record verified places, destinations, and travel memories.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Plus size={22} /> Add New Place
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '12px', borderRadius: '12px' }}>
              <Globe size={26} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Total Places</p>
              <h2 style={{ margin: '2px 0 0', fontSize: '26px', color: '#0f172a', fontWeight: '800' }}>{totalTrips}</h2>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#ecfdf5', color: '#10b981', padding: '12px', borderRadius: '12px' }}>
              <MapPin size={26} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Unique Cities</p>
              <h2 style={{ margin: '2px 0 0', fontSize: '26px', color: '#0f172a', fontWeight: '800' }}>{uniqueDestinations}</h2>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#fffbeb', color: '#f59e0b', padding: '12px', borderRadius: '12px' }}>
              <Award size={26} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Avg Rating</p>
              <h2 style={{ margin: '2px 0 0', fontSize: '26px', color: '#0f172a', fontWeight: '800' }}>{avgRating} <span style={{ fontSize: '16px', color: '#f59e0b' }}>★</span></h2>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* TRIP CARDS */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1e293b' }}>Verified Places & Trips</h2>
          <span style={{ fontSize: '14px', color: '#64748b' }}>Showing {trips.length} entries</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6366f1', fontWeight: '600' }}>Loading your trip vault...</div>
        ) : trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
            <Sparkles size={48} style={{ color: '#8b5cf6', marginBottom: '14px' }} />
            <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '20px' }}>No Places Added Yet</h3>
            <p style={{ color: '#64748b', margin: '0 0 20px' }}>Click below to add a valid city or destination!</p>
            <button
              onClick={handleOpenCreateModal}
              style={{ backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              + Add Real Place
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {trips.map((trip, idx) => {
              const borderColors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];
              const accentColor = borderColors[idx % borderColors.length];

              return (
                <div
                  key={trip._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div>
                    <div style={{ height: '6px', backgroundColor: accentColor }} />
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '19px', fontWeight: '700' }}>{trip.title}</h3>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => handleOpenEditModal(trip)} style={{ background: '#f1f5f9', border: 'none', color: '#475569', cursor: 'pointer', padding: '6px', borderRadius: '6px' }} title="Edit"><Edit2 size={15} /></button>
                          <button onClick={() => handleDelete(trip._id, trip.title)} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '6px' }} title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </div>

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '14px' }}>
                        <MapPin size={14} style={{ color: accentColor }} /> {trip.destination}
                      </div>

                      {(trip.startDate || trip.endDate) && (
                        <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} />
                          {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'} — {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'N/A'}
                        </p>
                      )}

                      {trip.description && (
                        <p style={{ margin: '0 0 16px', color: '#475569', fontSize: '14px', lineHeight: '1.5', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                          {trip.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '12px 20px', backgroundColor: '#fafafa', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Rating</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill={i < (trip.rating || 5) ? '#f59e0b' : 'none'} color={i < (trip.rating || 5) ? '#f59e0b' : '#cbd5e1'} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL FORM WITH ALERT DISPLAY */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '20px 24px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{editingTripId ? '✏️ Edit Location Details' : '📍 Add Real Destination'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>

              {validationError && (
                <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* DESTINATION INPUT */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Real Geographical Location *</label>
                <input
                  type="text"
                  required
                  list="city-suggestions"
                  value={formData.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  placeholder="Enter city or location (e.g., Paris, Tokyo, Goa, London)..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }}
                />
                <datalist id="city-suggestions">
                  {locationSuggestions.map((loc, i) => (
                    <option key={i} value={loc} />
                  ))}
                </datalist>
              </div>

              {/* TITLE */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Trip Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Summer Vacation"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              {/* DATES */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notes, memories, or spots in this location..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              {/* RATING */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', backgroundColor: '#fff' }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Amazing</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - Great</option>
                  <option value={3}>⭐⭐⭐ 3 - Average</option>
                  <option value={2}>⭐⭐ 2 - Poor</option>
                  <option value={1}>⭐ 1 - Very Bad</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifyingLocation}
                  style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {verifyingLocation ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Checking Location...
                    </>
                  ) : (
                    editingTripId ? 'Save Changes' : 'Save Real Place'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;