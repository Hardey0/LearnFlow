
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Key, Eye, EyeOff } from 'lucide-react';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (accessKey !== 'ADMIN101') {
        setError('Invalid admin access key');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      if (admins.some((admin) => admin.email === email)) {
        setError('Email already registered');
        setIsLoading(false);
        return;
      }

      const newAdmin = {
        id: Date.now(),
        name,
        email,
        password,
        isAdmin: true,
      };

      admins.push(newAdmin);
      localStorage.setItem('admins', JSON.stringify(admins));
      localStorage.setItem('currentAdmin', JSON.stringify(newAdmin));
      navigate('/admin/dashboard');
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
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const inputContainerStyle = {
    position: 'relative',
    width: '100%',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    padding: '12px',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  };

  const linkContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
    textAlign: 'center',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
    opacity: 0.8,
    transition: 'opacity 0.3s',
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
  };

  const titleStyle = {
    fontSize: '1.8rem',
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
          <h2 style={titleStyle}>Admin Sign Up</h2>
          <p style={{ opacity: 0.8 }}>Create an admin account to manage content.</p>
        </div>
        <form style={formStyle} onSubmit={handleSignup}>
          <div style={inputContainerStyle}>
            <User size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.5)' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div style={inputContainerStyle}>
            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: '40px' }}
            />
          </div>
          <div style={inputContainerStyle}>
            <Key size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type="text"
              placeholder="Admin Access Key"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          {error && <div style={errorStyle}>{error}</div>}
          <motion.button
            type="submit"
            style={buttonStyle}
            disabled={isLoading}
            whileHover={{ backgroundColor: '#0891b2' }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </motion.button>
        </form>
        <div style={linkContainerStyle}>
          <Link to="/admin/login" style={linkStyle}>Already have an admin account? Login</Link>
          <Link to="/signup" style={linkStyle}>User Sign Up</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignup;
