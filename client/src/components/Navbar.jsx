import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, LogOut, ShieldCheck } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to={user ? '/dashboard' : '/'} className="nav-brand">
          <div className="nav-logo-icon">
            <Compass size={22} />
          </div>
          <span>TripVault</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <div className="nav-user">
                <div className="nav-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user.name}</span>
                <ShieldCheck size={16} style={{ color: '#10b981' }} />
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.2rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', width: 'auto' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;