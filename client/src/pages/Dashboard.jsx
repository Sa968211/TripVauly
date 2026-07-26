import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, LogOut } from 'lucide-react';

const Dashboard = ({ user, token }) => {
  const [profile, setProfile] = useState(user);

  const activeToken = token || localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!activeToken) return;
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
      }
    };

    fetchUserProfile();
  }, [activeToken]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const userName = profile?.name || user?.name || 'Traveler';
  const userEmail = profile?.email || user?.email || '';

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Welcome Hero Card */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem', color: '#ffffff' }}>
            Welcome, <span className="user-gradient-text">{userName}</span>! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            You are successfully logged in to your TripVault account.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.9rem',
            gap: '0.5rem',
            color: '#fca5a5',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            background: 'rgba(239, 68, 68, 0.1)',
          }}
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {/* User Profile Info Card */}
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '540px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="stat-icon-wrapper stat-icon-indigo">
            <User size={22} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
            User Account Profile
          </h3>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Logged-In Name
          </label>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
            {userName}
          </div>
        </div>

        {userEmail && (
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginTop: '0.2rem', fontSize: '0.95rem' }}>
              <Mail size={16} style={{ color: 'var(--primary)' }} />
              <span>{userEmail}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;