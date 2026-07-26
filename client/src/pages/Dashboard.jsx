import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, LogOut, CheckCircle2, Sparkles } from 'lucide-react';

const Dashboard = ({ user, token }) => {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);

  const activeToken = token || localStorage.getItem('token') || '';

  const fetchUserProfile = async () => {
    if (!activeToken) return;
    setLoading(true);
    try {
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const userName = profile?.name || user?.name || 'Traveler';
  const userEmail = profile?.email || user?.email || 'N/A';
  const userId = profile?.id || profile?._id || user?.id || 'N/A';

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Hero Welcome Card */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div
              style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <CheckCircle2 size={14} /> Authenticated Session
            </div>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
            Welcome, <span className="user-gradient-text">{userName}</span>! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px' }}>
            You have successfully logged in to <strong>TripVault</strong>.
          </p>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{
              padding: '0.7rem 1.5rem',
              fontSize: '0.95rem',
              gap: '0.5rem',
              color: '#fca5a5',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.1)',
            }}
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>

      {/* User Identity Card */}
      <div className="glass-card stat-card" style={{ padding: '2rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
        <div>
          <div className="stat-header" style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              USER PROFILE
            </span>
            <div className="stat-icon-wrapper stat-icon-indigo">
              <User size={22} />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Logged-In User
            </label>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
              {userName}
            </h3>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginTop: '0.2rem', fontSize: '1rem' }}>
              <Mail size={18} style={{ color: 'var(--primary)' }} />
              <span>{userEmail}</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              User ID
            </label>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#93c5fd', marginTop: '0.2rem' }}>
              {userId}
            </div>
          </div>
        </div>
      </div>

      {/* Week 1 Status Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'rgba(99, 102, 241, 0.08)',
          borderColor: 'rgba(99, 102, 241, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="nav-logo-icon" style={{ width: '44px', height: '44px' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>TripVault Week 1 Complete</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Backend server, MongoDB, JWT auth, and React Router dashboard are working end-to-end.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchUserProfile} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
            Re-verify /api/auth/me
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;