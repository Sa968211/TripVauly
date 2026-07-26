import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('token');
          setUser(null);
          setToken('');
        }
      } catch (err) {
        console.error('Session verification error:', err);
        localStorage.removeItem('token');
        setUser(null);
        setToken('');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const handleAuthSuccess = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route
              path="/"
              element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" replace /> : <Login onAuthSuccess={handleAuthSuccess} />}
            />
            <Route
              path="/register"
              element={token ? <Navigate to="/dashboard" replace /> : <Register onAuthSuccess={handleAuthSuccess} />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={!!token} loading={loading}>
                  <Dashboard user={user} token={token} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;