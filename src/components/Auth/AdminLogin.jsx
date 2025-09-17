
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Key, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (accessKey !== 'ADMIN101') {
        setError('Invalid admin access key');
        setIsLoading(false);
        return;
      }

      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      const admin = admins.find((a) => a.email === email && a.password === password);

      if (admin) {
        localStorage.setItem('currentAdmin', JSON.stringify({ ...admin, isAdmin: true }));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '"Inter", sans-serif',
    color: '#fff',
  };

  const containerStyle = {
    maxWidth: '400px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const inputStyle = {
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '1rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  };

  const linkStyle = {
    textAlign: 'center',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    opacity: 0.8,
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.9rem',
    textAlign: 'center',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '1.5rem',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  return (
    <div style={pageStyle}>
      <motion.div
        style={containerStyle}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={headerStyle}>
          <h2 style={titleStyle}>Admin Login</h2>
          <p style={{ opacity: 0.8 }}>Sign in to access the admin dashboard.</p>
        </div>
        <form style={formStyle} onSubmit={handleLogin}>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ ...inputStyle, paddingLeft: '3rem' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingLeft: '3rem', paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.5)' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Key size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type="text"
              placeholder="Access Key"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              required
              style={{ ...inputStyle, paddingLeft: '3rem' }}
            />
          </div>
          {error && <div style={errorStyle}>{error}</div>}
          <button type="submit" style={buttonStyle} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Link to="/admin/signup" style={linkStyle}>Don't have an admin account? Sign  | </Link>
        <Link to="/login" style={linkStyle}>User Login</Link>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
