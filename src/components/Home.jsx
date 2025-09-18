
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Brain, Mic, Star, Trophy, Users, TrendingUp, Clock, Target, PenTool, BarChart3, Play, ChevronRight, Trash2 } from 'lucide-react';
import { lessons } from '../data/lessons';

const Home = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [recentLesson, setRecentLesson] = useState(null);

  // Load progress and find recent lesson
  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('progress') || '{}');
    setProgress(storedProgress);

    // Find the most recently completed lesson
    const completedLessons = lessons.filter((lesson) => storedProgress[lesson.id]?.score >= 0);
    const recent = completedLessons.sort((a, b) => b.id - a.id)[0];
    setRecentLesson(recent || lessons[0]); // Fallback to first lesson if none completed
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Clear progress
  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      localStorage.removeItem('progress');
      setProgress({});
      setRecentLesson(lessons[0]);
    }
  };

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    position: 'relative',
    overflow: 'auto',
    paddingTop: '80px',
    fontFamily: '"Inter", sans-serif',
    color: '#fff',
    boxSizing: 'border-box',
  };

  const backgroundPattern = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    background: `
      radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)
    `,
    zIndex: 1,
    pointerEvents: 'none',
  };

  const containerStyle = {
    position: 'relative',
    zIndex: 2,
    padding: '20px',
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '0 10px',
  };

  const mainTitleStyle = {
    fontSize: 'clamp(2rem, 8vw, 4rem)',
    fontWeight: '900',
    marginBottom: '15px',
    background: 'linear-gradient(45deg, #ffffff, #f0f9ff, #ddd6fe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  };

  const subtitleStyle = {
    fontSize: 'clamp(1rem, 4vw, 1.3rem)',
    marginBottom: '30px',
    opacity: 0.9,
    fontWeight: '300',
    lineHeight: '1.5',
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '40px',
    padding: '0 10px',
  };

  const statCardStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const quickActionsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
    padding: '0 10px',
  };

  const categoriesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    padding: '0 10px',
    marginBottom: '40px',
  };

  const welcomeSectionStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '2rem',
    marginBottom: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    fontSize: '0.95rem',
  };

  const featuredLessonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '2rem',
    marginBottom: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const testimonialsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    padding: '0 10px',
    marginBottom: '40px',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    padding: '30px',
    borderRadius: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    color: '#fff',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const quickActionCardStyle = {
    ...cardStyle,
    minHeight: '160px',
    background: 'rgba(255, 255, 255, 0.12)',
    padding: '25px',
  };

  const iconContainerStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 15px auto',
    position: 'relative',
    zIndex: 2,
  };

  const cardTitleStyle = {
    fontSize: 'clamp(18px, 4vw, 22px)',
    fontWeight: '700',
    marginBottom: '10px',
    position: 'relative',
    zIndex: 2,
  };

  const cardTextStyle = {
    opacity: 0.9,
    fontSize: 'clamp(14px, 3vw, 16px)',
    lineHeight: '1.5',
    position: 'relative',
    zIndex: 2,
    flex: 1,
  };

  const floatingElementStyle = {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    pointerEvents: 'none',
    display: window.innerWidth > 768 ? 'block' : 'none',
  };

  const quickActions = [
    {
      name: 'Start Learning',
      description: 'Begin with structured lessons',
      icon: Play,
      path: '/lessons',
      color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    },
    {
      name: 'Take Quiz',
      description: 'Test your knowledge',
      icon: Target,
      path: '/quiz/1',
      color: 'linear-gradient(135deg, #22c55e, #059669)',
    },
    {
      name: 'View Progress',
      description: 'Track your improvement',
      icon: BarChart3,
      path: '/progress',
      color: 'linear-gradient(135deg, #facc15, #d97706)',
    },
    {
      name: 'Practice Writing',
      description: 'Improve your skills',
      icon: PenTool,
      path: '/practice',
      color: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    },
  ];

  const categories = [
    {
      name: 'Vocabulary',
      description: 'Master new words with interactive exercises',
      icon: BookOpen,
      path: '/lessons',
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    },
    {
      name: 'Grammar',
      description: 'Perfect your grammar with comprehensive lessons',
      icon: Brain,
      path: '/lessons',
      gradient: 'linear-gradient(135deg, #22c55e, #059669)',
    },
    {
      name: 'Pronunciation',
      description: 'Improve speaking with AI-powered feedback',
      icon: Mic,
      path: '/lessons',
      gradient: 'linear-gradient(135deg, #facc15, #d97706)',
    },
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Learners' },
    { icon: Trophy, value: '95%', label: 'Success Rate' },
    { icon: Clock, value: '2.5M', label: 'Hours Learned' },
    { icon: Star, value: '4.9', label: 'User Rating' },
  ];

  const testimonials = [
    {
      name: 'Anna S.',
      text: 'This platform transformed my English skills! The quizzes are engaging and effective.',
      rating: 5,
    },
    {
      name: 'Mark T.',
      text: 'The lessons are well-structured, and the progress tracking keeps me motivated.',
      rating: 4.8,
    },
    {
      name: 'Priya R.',
      text: 'I love the pronunciation exercises. They’ve helped me speak more confidently!',
      rating: 4.9,
    },
  ];

  // Calculate progress summary
  const summary = {
    completedLessons: Object.keys(progress).filter(
      (id) => progress[id]?.score >= 0 && progress[id]?.total > 0
    ).length,
    averageScore: Object.values(progress).reduce(
      (sum, { score, total }) => sum + (score / total) * 100,
      0
    ) / (Object.keys(progress).length || 1),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const titleVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delay: 0.1,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    tap: { scale: 0.97 },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .container {
            padding: 15px !important;
          }
          .header {
            margin-bottom: 30px !important;
          }
          .main-title {
            font-size: clamp(1.8rem, 7vw, 3rem) !important;
          }
          .subtitle {
            font-size: clamp(0.9rem, 3.5vw, 1.1rem) !important;
          }
          .welcome-section {
            padding: 1.5rem !important;
          }
          .button-container {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          .button {
            display: inline-block !important;
            width: 100% !important;
            padding: 0.6rem 1rem !important;
            font-size: 0.9rem !important;
            margin: 0.5rem 0 !important;
            justify-content: center !important;
          }
          .stats-container {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .quick-actions, .categories-grid, .testimonials {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          .card, .quick-action-card {
            padding: 20px !important;
            min-height: 180px !important;
          }
          .card-title {
            font-size: clamp(16px, 3.5vw, 18px) !important;
          }
          .card-text {
            font-size: clamp(13px, 3vw, 14px) !important;
          }
        }
        @media (max-width: 480px) {
          .container {
            padding: 10px !important;
          }
          .header {
            margin-bottom: 20px !important;
          }
          .main-title {
            font-size: clamp(1.5rem, 6vw, 2.5rem) !important;
          }
          .subtitle {
            font-size: clamp(0.8rem, 3vw, 1rem) !important;
          }
          .welcome-section {
            padding: 1rem !important;
          }
          .button {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.85rem !important;
            margin: 0.4rem 0 !important;
          }
          .stats-container {
            gap: 10px !important;
          }
          .quick-actions, .categories-grid, .testimonials {
            gap: 12px !important;
          }
          .card, .quick-action-card {
            padding: 15px !important;
            min-height: 160px !important;
          }
          .card-title {
            font-size: clamp(14px, 3vw, 16px) !important;
          }
          .card-text {
            font-size: clamp(12px, 2.5vw, 13px) !important;
          }
        }
        .button:hover {
          background-color: #0e7490 !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
          transform: translateY(-2px) !important;
        }
        .clear-button:hover {
          background-color: #dc2626 !important;
        }
        .button:active {
          transform: translateY(0) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>

      <div style={pageStyle}>
        {/* Background Pattern */}
        <div style={backgroundPattern} />

        {/* Floating Elements */}
        <motion.div
          style={{
            ...floatingElementStyle,
            width: '80px',
            height: '80px',
            top: '15%',
            left: '5%',
          }}
          animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{
            ...floatingElementStyle,
            width: '50px',
            height: '50px',
            top: '25%',
            right: '8%',
          }}
          animate={{ y: [0, 15, 0], x: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          style={containerStyle}
          className="container"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div style={headerStyle} className="header" variants={titleVariants}>
            <motion.h1
              style={mainTitleStyle}
              className="main-title"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              Master English
            </motion.h1>
            <motion.p style={subtitleStyle} className="subtitle" variants={itemVariants}>
              Transform your language skills with AI-powered learning
            </motion.p>
          </motion.div>

          {/* Welcome Section */}
          <motion.div
            style={welcomeSectionStyle}
            className="welcome-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>
              Welcome Back!
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '1.5rem' }}>
              You've completed {summary.completedLessons} of {lessons.length} lessons.
              {summary.completedLessons > 0
                ? ` Your average score is ${summary.averageScore.toFixed(2)}%.`
                : ' Start a lesson to track your progress!'}
            </p>
            <div style={buttonContainerStyle} className="button-container">
              <motion.button
                style={buttonStyle}
                className="button"
                onClick={() => handleNavigation('/lessons')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Start learning lessons"
              >
                <Play size={20} /> Get Started
              </motion.button>
              {summary.completedLessons > 0 && (
                <motion.button
                  style={{ ...buttonStyle, backgroundColor: '#ef4444' }}
                  className="button clear-button"
                  onClick={handleClearProgress}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Clear all progress"
                >
                  <Trash2 size={20} /> Clear Progress
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Featured Lesson */}
          {recentLesson && (
            <motion.div
              style={featuredLessonStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>
                Featured Lesson
              </h2>
              <motion.div
                style={cardStyle}
                whileHover={cardHoverVariants.hover}
                whileTap={cardHoverVariants.tap}
                onClick={() => handleNavigation(`/lessons/${recentLesson.id}`)}
              >
                <motion.div
                  style={iconContainerStyle}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <BookOpen size={32} />
                </motion.div>
                <h3 style={cardTitleStyle} className="card-title">{recentLesson.title}</h3>
                <p style={cardTextStyle} className="card-text">
                  {recentLesson.description || 'Explore this lesson to boost your skills!'}
                </p>
                <motion.div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}
                  whileHover={{ x: 5 }}
                >
                  <ChevronRight size={20} />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Stats Section */}
          <motion.div style={statsContainerStyle} className="stats-container" variants={containerVariants}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                style={statCardStyle}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div variants={pulseVariants} animate="animate">
                  <stat.icon size={32} color="#fff" />
                </motion.div>
                <motion.div
                  style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 'bold', margin: '8px 0' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                >
                  {stat.value}
                </motion.div>
                <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', opacity: 0.8 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions Section */}
          <motion.div style={quickActionsStyle} className="quick-actions" variants={containerVariants}>
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                style={{ ...quickActionCardStyle, background: action.color }}
                className="quick-action-card"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                whileTap={cardHoverVariants.tap}
                onClick={() => handleNavigation(action.path)}
              >
                <motion.div
                  style={iconContainerStyle}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <action.icon size={28} />
                </motion.div>
                <motion.h3
                  style={cardTitleStyle}
                  className="card-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {action.name}
                </motion.h3>
                <motion.p
                  style={cardTextStyle}
                  className="card-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {action.description}
                </motion.p>
                <motion.div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}
                  whileHover={{ x: 5 }}
                >
                  <ChevronRight size={20} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Learning Categories */}
          <motion.div style={categoriesGridStyle} className="categories-grid" variants={containerVariants}>
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                style={{ ...cardStyle, background: category.gradient }}
                className="card"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                whileTap={cardHoverVariants.tap}
                onClick={() => handleNavigation(category.path)}
              >
                <motion.div
                  style={iconContainerStyle}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <category.icon size={32} />
                </motion.div>
                <motion.h3
                  style={cardTitleStyle}
                  className="card-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {category.name}
                </motion.h3>
                <motion.p
                  style={cardTextStyle}
                  className="card-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {category.description}
                </motion.p>
                <motion.div
                  style={{
                    width: '100%',
                    height: '3px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '2px',
                    marginTop: '20px',
                    overflow: 'hidden',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${60 + index * 15}%` }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 1.5 }}
                >
                  <motion.div
                    style={{
                      height: '100%',
                      background: '#22c55e',
                      borderRadius: '2px',
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials Section */}
          <motion.div style={testimonialsStyle} className="testimonials" variants={containerVariants}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                style={cardStyle}
                className="card"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                whileTap={cardHoverVariants.tap}
              >
                <motion.div
                  style={iconContainerStyle}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Star size={32} />
                </motion.div>
                <motion.h3
                  style={cardTitleStyle}
                  className="card-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {testimonial.name}
                </motion.h3>
                <motion.p
                  style={cardTextStyle}
                  className="card-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {testimonial.text}
                </motion.p>
                <motion.div
                  style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
                    <Star key={i} size={16} fill="#facc15" color="#facc15" />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Home;
