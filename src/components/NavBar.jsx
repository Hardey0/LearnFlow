import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Target, BarChart3, PenTool, Menu, X, Star, Zap, User, LogOut, Pen, Save, Settings, Award, TrendingUp } from 'lucide-react';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState({ name: '', email: '' });
  const [userPoints, setUserPoints] = useState(0);
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const [pointsNotification, setPointsNotification] = useState({ points: 0, activity: '' });
  const location = useLocation();
  const navigate = useNavigate();

  // Points system configuration
  const POINTS_CONFIG = {
    LESSON_COMPLETE: 50,
    QUIZ_PERFECT: 100,
    QUIZ_PASS: 75,
    QUIZ_FAIL: 25,
    DAILY_LOGIN: 10,
    STREAK_BONUS: 25,
    VIDEO_WATCHED: 15,
    PRACTICE_SUBMITTED: 30,
    PROFILE_COMPLETE: 20,
    FIRST_LESSON: 100,
    CONSECUTIVE_DAYS: 50
  };

  // Activity display names
  const ACTIVITY_NAMES = {
    LESSON_COMPLETE: 'completing a lesson',
    QUIZ_PERFECT: 'perfect quiz score',
    QUIZ_PASS: 'passing a quiz',
    QUIZ_FAIL: 'attempting a quiz',
    DAILY_LOGIN: 'daily login bonus',
    STREAK_BONUS: 'maintaining streak',
    VIDEO_WATCHED: 'watching a video',
    PRACTICE_SUBMITTED: 'submitting practice',
    PROFILE_COMPLETE: 'completing profile',
    FIRST_LESSON: 'completing first lesson',
    CONSECUTIVE_DAYS: 'consecutive day bonus'
  };

  // Level calculation functions
  const calculateLevel = (points) => {
    return Math.floor(points / 500) + 1;
  };

  const getPointsToNextLevel = (points) => {
    const currentLevel = calculateLevel(points);
    const pointsForNextLevel = currentLevel * 500;
    return pointsForNextLevel - points;
  };

  const getLevelProgress = (points) => {
    const currentLevel = calculateLevel(points);
    const pointsForCurrentLevel = (currentLevel - 1) * 500;
    const pointsForNextLevel = currentLevel * 500;
    const progressPoints = points - pointsForCurrentLevel;
    const totalPointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    return (progressPoints / totalPointsNeeded) * 100;
  };

  // Points management functions
  const awardPoints = (activity, multiplier = 1) => {
    if (!user) return;

    const points = POINTS_CONFIG[activity] * multiplier;
    const newTotal = userPoints + points;
    
    setUserPoints(newTotal);
    
    // Update user object with new points and activity tracking
    const updatedUser = { 
      ...user, 
      points: newTotal,
      lastActivity: new Date().toISOString(),
      totalActivities: (user.totalActivities || 0) + 1,
      lastLoginDate: new Date().toDateString(),
      activityHistory: [
        ...(user.activityHistory || []),
        {
          activity,
          points,
          timestamp: new Date().toISOString(),
          totalPoints: newTotal
        }
      ].slice(-50) // Keep last 50 activities
    };
    
    // Save to localStorage
    const storageKey = user.isAdmin ? 'currentAdmin' : 'currentUser';
    localStorage.setItem(storageKey, JSON.stringify(updatedUser));
    
    // Update users array
    const usersKey = user.isAdmin ? 'admins' : 'users';
    const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
    const updatedUsers = users.map(u => 
      u.email === user.email ? updatedUser : u
    );
    localStorage.setItem(usersKey, JSON.stringify(updatedUsers));
    
    setUser(updatedUser);
    
    // Show notification
    showPointsAnimation(points, activity);
  };

  // Points notification animation
  const showPointsAnimation = (points, activity) => {
    setPointsNotification({ points, activity });
    setShowPointsNotification(true);
    
    setTimeout(() => {
      setShowPointsNotification(false);
    }, 3000);
  };

  // Daily login bonus check
  const checkDailyLoginBonus = () => {
    if (!user) return;
    
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate;
    
    if (lastLogin !== today) {
      // Award daily login bonus
      setTimeout(() => awardPoints('DAILY_LOGIN'), 1000);
      
      // Check for consecutive days
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin === yesterday.toDateString()) {
        setTimeout(() => awardPoints('CONSECUTIVE_DAYS'), 1500);
      }
    }
  };

  // Expose points functions globally for other components
  useEffect(() => {
    window.awardPoints = awardPoints;
    window.POINTS_CONFIG = POINTS_CONFIG;
    
    return () => {
      delete window.awardPoints;
      delete window.POINTS_CONFIG;
    };
  }, [userPoints, user]);

  // Load user from localStorage with points
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin') || 'null');
    const userData = currentUser || currentAdmin;
    
    console.log('Loading user data:', { currentUser, currentAdmin, userData });
    
    if (userData) {
      setUser(userData);
      setEditUser(userData);
      setUserPoints(userData.points || 0);
      
      // Check for daily login bonus
      checkDailyLoginBonus();
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and profile dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowProfile(false);
  }, [location]);

  // Close mobile menu and profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
      if (showProfile && !event.target.closest('.user-avatar') && !event.target.closest('.user-dropdown')) {
        setShowProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen, showProfile]);

  // Handle logout - Fixed
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAdmin');
    
    setUser(null);
    setEditUser({ name: '', email: '' });
    setUserPoints(0);
    setShowProfile(false);
    setEditingProfile(false);
    
    navigate('/');
    console.log('User logged out');
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setEditingProfile(true);
    setShowProfile(false);
  };

  // Save profile changes - Fixed with points bonus
  const handleSaveProfile = () => {
    if (user && user.email && editUser.name && editUser.email) {
      const isAdmin = user.isAdmin;
      const storageKey = isAdmin ? 'admins' : 'users';
      const currentUserKey = isAdmin ? 'currentAdmin' : 'currentUser';
      
      const users = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedUsers = users.map((u) =>
        u.email === user.email 
          ? { ...u, name: editUser.name, email: editUser.email }
          : u
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedUsers));
      
      const updatedUser = { ...user, ...editUser };
      localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      setEditUser(updatedUser);
      setEditingProfile(false);
      
      // Award points for profile completion
      if (!user.profileCompleted) {
        updatedUser.profileCompleted = true;
        localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));
        awardPoints('PROFILE_COMPLETE');
      }
      
      console.log('Profile updated:', updatedUser);
    }
  };

  // Cancel profile edit
  const handleCancelEdit = () => {
    setEditUser(user || { name: '', email: '' });
    setEditingProfile(false);
  };

  // Get current page from location
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path.startsWith('/lessons') || path.startsWith('/quiz')) return path.split('/')[1];
    return path.substring(1);
  };

  const currentPage = getCurrentPage();

  // Styles
  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: isScrolled
      ? 'rgba(15, 118, 110, 0.95)'
      : 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: isScrolled 
      ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
      : '0 5px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '80px',
    position: 'relative',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  };

  const logoIconStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '15px',
    background: 'linear-gradient(135deg, #ffffff, #f0f9ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
  };

  const logoTextStyle = {
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #ffffff, #e0e7ff, #c7d2fe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const desktopNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const navLinkStyle = {
    position: 'relative',
    padding: '12px 20px',
    borderRadius: '15px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'transparent',
    border: 'none',
    outline: 'none',
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  const mobileMenuButtonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    cursor: 'pointer',
    padding: '12px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const mobileMenuOverlayStyle = {
    position: 'fixed',
    top: '80px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    zIndex: 999,
  };

  const mobileMenuStyle = {
    position: 'fixed',
    top: '80px',
    left: '20px',
    right: '20px',
    background: 'rgba(15, 118, 110, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    maxHeight: '70vh',
    overflowY: 'auto',
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  };

  const userAvatarStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
  };

  const pointsBadgeStyle = {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    padding: '8px 16px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    position: 'relative'
  };

  const userDropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'rgba(15, 118, 110, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    zIndex: 1001,
    minWidth: '320px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginTop: '10px'
  };

  const profileItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '8px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputStyle = {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    marginBottom: '12px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#0891b2',
    color: '#fff',
    borderRadius: '10px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease'
  };

  const mobileNavLinkStyle = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '15px',
    color: 'white',
    background: 'transparent',
    border: 'none',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '8px',
    outline: 'none',
  };

  const activeMobileNavLinkStyle = {
    ...mobileNavLinkStyle,
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  const pointsNotificationStyle = {
    position: 'fixed',
    top: '100px',
    right: '20px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    zIndex: 10000,
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Lessons', icon: BookOpen, path: '/lessons' },
    { name: 'Quiz', icon: Target, path: '/quiz/1' },
    { name: 'Progress', icon: BarChart3, path: '/progress' },
    { name: 'Practice', icon: PenTool, path: '/practice' },
  ];

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(15, 118, 110, 0.5)',
        '0 0 30px rgba(8, 145, 178, 0.7)',
        '0 0 20px rgba(15, 118, 110, 0.5)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const floatingIconVariants = {
    animate: {
      y: [0, -5, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .points-badge { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 480px) {
          .logo-text { font-size: 18px !important; }
          .user-avatar { width: 40px !important; height: 40px !important; }
          .nav-container { padding: 0 15px !important; }
          .mobile-menu { left: 15px !important; right: 15px !important; padding: 20px !important; }
          .mobile-nav-link { font-size: 16px !important; padding: 12px 15px !important; }
          .points-notification { right: 10px !important; top: 90px !important; }
        }
      `}</style>

      <motion.nav
        style={navStyle}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div style={containerStyle} className="nav-container">
          {/* Animated Logo */}
          <motion.div variants={itemVariants}>
            <Link to="/" style={logoContainerStyle}>
              <motion.div
                style={logoIconStyle}
                variants={glowVariants}
                animate="animate"
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div variants={floatingIconVariants} animate="animate">
                  <Zap size={24} color="#0891b2" />
                </motion.div>
              </motion.div>
              <motion.h1
                style={logoTextStyle}
                className="logo-text"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                LearnFlow
              </motion.h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div style={desktopNavStyle} className="desktop-nav" variants={itemVariants}>
            {navItems.map((item) => {
              const isActive =
                (item.path === '/' && currentPage === 'home') ||
                (item.path !== '/' && currentPage === item.path.split('/')[1]);

              return (
                <motion.div key={item.name}>
                  <Link
                    to={item.path}
                    style={isActive ? activeNavLinkStyle : navLinkStyle}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <motion.div
                      animate={hoveredItem === item.name ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <item.icon size={18} />
                    </motion.div>
                    <span>{item.name}</span>
                    {hoveredItem === item.name && (
                      <motion.div
                        layoutId="hover-indicator"
                        style={{
                          position: 'absolute',
                          bottom: '-5px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'white',
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
            {user && user.isAdmin && (
              <motion.div>
                <Link
                  to="/admin/dashboard"
                  style={currentPage === 'admin' ? activeNavLinkStyle : navLinkStyle}
                  onMouseEnter={() => setHoveredItem('admin')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    animate={hoveredItem === 'admin' ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Settings size={18} />
                  </motion.div>
                  <span>Admin</span>
                  {hoveredItem === 'admin' && (
                    <motion.div
                      layoutId="hover-indicator"
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'white',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* User Profile Section */}
          <motion.div style={userSectionStyle} variants={itemVariants}>
            {/* Enhanced Points Badge */}
            <motion.div
              style={pointsBadgeStyle}
              className="points-badge"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(16, 185, 129, 0.5)',
                  '0 0 20px rgba(16, 185, 129, 0.8)',
                  '0 0 10px rgba(16, 185, 129, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              title={user ? `Level ${calculateLevel(userPoints)} • ${getPointsToNextLevel(userPoints)} XP to next level` : 'Login to start earning XP!'}
            >
              <Star size={16} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{userPoints.toLocaleString()}</span>
                <span style={{ fontSize: '10px', opacity: 0.8, lineHeight: 1 }}>
                  Level {calculateLevel(userPoints)}
                </span>
              </div>
              {user && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-2px', 
                  left: '8px', 
                  right: '8px', 
                  height: '2px', 
                  background: 'rgba(255,255,255,0.3)', 
                  borderRadius: '1px',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: 'white',
                      borderRadius: '1px'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getLevelProgress(userPoints)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              )}
            </motion.div>

            {/* Fixed User Avatar */}
            <motion.div
              style={userAvatarStyle}
              className="user-avatar"
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 25px rgba(251, 191, 36, 0.6)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(!showProfile)}
            >
              {user && user.name ? (
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: 'white' 
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={20} color="white" />
              )}
            </motion.div>

            {/* Enhanced User Profile Dropdown with Points Info */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  style={userDropdownStyle}
                  className="user-dropdown"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {user ? (
                    <>
                      <div style={{ 
                        marginBottom: '16px', 
                        paddingBottom: '12px', 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                              {user.name}
                            </h3>
                            <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>
                              {user.email}
                            </p>
                          </div>
                          {user.isAdmin && (
                            <span style={{ 
                              fontSize: '11px', 
                              background: 'rgba(59, 130, 246, 0.3)', 
                              padding: '3px 8px', 
                              borderRadius: '10px'
                            }}>
                              Admin
                            </span>
                          )}
                        </div>
                        
                        {/* Points and Level Info */}
                        <div style={{ 
                          marginTop: '12px',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                              {userPoints.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>Total XP</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>
                              {calculateLevel(userPoints)}
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>Level</div>
                          </div>
                        </div>
                        
                        {/* Level Progress Bar */}
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            opacity: 0.8,
                            marginBottom: '4px'
                          }}>
                            <span>Level {calculateLevel(userPoints)}</span>
                            <span>{getPointsToNextLevel(userPoints)} XP to go</span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '6px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <motion.div
                              style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #10b981, #fbbf24)',
                                borderRadius: '3px'
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${getLevelProgress(userPoints)}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent Activity */}
                      {user.activityHistory && user.activityHistory.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                            Recent Activity
                          </h4>
                          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                            {user.activityHistory.slice(-3).reverse().map((activity, index) => (
                              <div key={index} style={{ 
                                fontSize: '12px', 
                                opacity: 0.8, 
                                marginBottom: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <span>{ACTIVITY_NAMES[activity.activity] || activity.activity}</span>
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                                  +{activity.points} XP
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <motion.button 
                        style={{
                          ...profileItemStyle,
                          background: 'transparent',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        onClick={handleEditProfile}
                      >
                        <Pen size={16} /> 
                        Edit Profile
                      </motion.button>
                      
                      {user.isAdmin && (
                        <Link 
                          to="/admin/dashboard" 
                          style={profileItemStyle}
                          onClick={() => setShowProfile(false)}
                        >
                          <Settings size={16} /> 
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <motion.button 
                        style={{
                          ...profileItemStyle,
                          background: 'transparent',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        onClick={handleLogout}
                      >
                        <LogOut size={16} /> 
                        Logout
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                        <Award size={32} style={{ opacity: 0.6, marginBottom: '8px' }} />
                        <p style={{ fontSize: '14px', opacity: 0.8 }}>
                          Login to start earning XP and tracking your progress!
                        </p>
                      </div>
                      
                      <Link 
                        to="/login" 
                        style={profileItemStyle}
                        onClick={() => setShowProfile(false)}
                      >
                        <User size={16} /> 
                        Login
                      </Link>
                      
                      <Link 
                        to="/signup" 
                        style={profileItemStyle}
                        onClick={() => setShowProfile(false)}
                      >
                        <User size={16} /> 
                        Sign Up
                      </Link>
                      
                      <div style={{ 
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
                        marginTop: '8px', 
                        paddingTop: '8px' 
                      }}>
                        <Link 
                          to="/admin/login" 
                          style={profileItemStyle}
                          onClick={() => setShowProfile(false)}
                        >
                          <Settings size={16} /> 
                          Admin Login
                        </Link>
                        
                        <Link 
                          to="/admin/signup" 
                          style={profileItemStyle}
                          onClick={() => setShowProfile(false)}
                        >
                          <Settings size={16} /> 
                          Admin Sign Up
                        </Link>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Menu Button */}
            <motion.button
              style={mobileMenuButtonStyle}
              className="mobile-menu-btn mobile-menu-container"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              whileHover={{
                background: 'rgba(255, 255, 255, 0.2)',
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Points Notification */}
      <AnimatePresence>
        {showPointsNotification && (
          <motion.div
            style={pointsNotificationStyle}
            className="points-notification"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3, type: 'spring' }}
          >
            <Star size={20} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                +{pointsNotification.points} XP
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {ACTIVITY_NAMES[pointsNotification.activity]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editingProfile && user && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'rgba(15, 118, 110, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px' 
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  Edit Profile
                </h3>
                <motion.button 
                  onClick={handleCancelEdit} 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    border: 'none', 
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                  whileHover={{ background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <X size={18} />
                </motion.button>
              </div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  style={inputStyle}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button 
                    type="button" 
                    onClick={handleSaveProfile} 
                    style={buttonStyle}
                    whileHover={{ scale: 1.02, backgroundColor: '#0e7490' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={16} /> Save
                  </motion.button>
                  <motion.button 
                    type="button" 
                    onClick={handleCancelEdit} 
                    style={{ ...buttonStyle, backgroundColor: '#ef4444' }}
                    whileHover={{ scale: 1.02, backgroundColor: '#dc2626' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay and Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              style={mobileMenuOverlayStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              style={mobileMenuStyle}
              className="mobile-menu mobile-menu-container"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              {/* Enhanced Mobile Menu Header with Points */}
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '25px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                  {user ? user.name : 'Navigation'}
                </div>
                <div style={{
                  ...pointsBadgeStyle,
                  padding: '6px 12px',
                  fontSize: '12px'
                }}>
                  <Star size={14} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span>{userPoints.toLocaleString()}</span>
                    <span style={{ fontSize: '9px', opacity: 0.8, lineHeight: 1 }}>
                      Lv.{calculateLevel(userPoints)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Navigation Items */}
              {navItems.map((item, index) => {
                const isActive =
                  (item.path === '/' && currentPage === 'home') ||
                  (item.path !== '/' && currentPage === item.path.split('/')[1]);

                return (
                  <motion.div key={item.name}>
                    <Link
                      to={item.path}
                      style={isActive ? activeMobileNavLinkStyle : mobileNavLinkStyle}
                      className="mobile-nav-link"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <item.icon size={22} />
                        </motion.div>
                        <span>{item.name}</span>
                        {isActive && (
                          <motion.div
                            style={{
                              marginLeft: 'auto',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#10b981',
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Admin Dashboard for Mobile */}
              {user && user.isAdmin && (
                <motion.div>
                  <Link
                    to="/admin/dashboard"
                    style={currentPage === 'admin' ? activeMobileNavLinkStyle : mobileNavLinkStyle}
                    className="mobile-nav-link"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.1 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Settings size={22} />
                      </motion.div>
                      <span>Admin Dashboard</span>
                      {currentPage === 'admin' && (
                        <motion.div
                          style={{
                            marginLeft: 'auto',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#10b981',
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              )}

              {/* User-specific Mobile Menu Items */}
              {user ? (
                <>
                  <motion.div>
                    <motion.button
                      style={mobileNavLinkStyle}
                      onClick={handleEditProfile}
                      whileHover={{ x: 10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 1) * 0.1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Pen size={22} />
                        </motion.div>
                        <span>Edit Profile</span>
                      </motion.div>
                    </motion.button>
                  </motion.div>
                  <motion.div>
                    <motion.button
                      style={mobileNavLinkStyle}
                      onClick={handleLogout}
                      whileHover={{ x: 10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 2) * 0.1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <LogOut size={22} />
                        </motion.div>
                        <span>Logout</span>
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div>
                    <Link
                      to="/login"
                      style={mobileNavLinkStyle}
                      className="mobile-nav-link"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 1) * 0.1 }}
                        whileHover={{ x: 10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <User size={22} />
                        </motion.div>
                        <span>Login</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                  <motion.div>
                    <Link
                      to="/signup"
                      style={mobileNavLinkStyle}
                      className="mobile-nav-link"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 2) * 0.1 }}
                        whileHover={{ x: 10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <User size={22} />
                        </motion.div>
                        <span>Sign Up</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                  <motion.div>
                    <Link
                      to="/admin/login"
                      style={mobileNavLinkStyle}
                      className="mobile-nav-link"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 3) * 0.1 }}
                        whileHover={{ x: 10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Settings size={22} />
                        </motion.div>
                        <span>Admin Login</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                  <motion.div>
                    <Link
                      to="/admin/signup"
                      style={mobileNavLinkStyle}
                      className="mobile-nav-link"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 4) * 0.1 }}
                        whileHover={{ x: 10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Settings size={22} />
                        </motion.div>
                        <span>Admin Sign Up</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: '80px' }} />
    </>
  );
};

export default NavBar;