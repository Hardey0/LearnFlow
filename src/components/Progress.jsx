import { useState, useEffect, useMemo} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Trophy, Trash2, Filter } from 'lucide-react';
import { lessons } from '../data/lessons';

const Progress = () => {
  const [progress, setProgress] = useState({});
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('progress') || '{}');
    setProgress(storedProgress);
  }, []);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const completedLessons = Object.keys(progress).filter(
      (id) => progress[id]?.score >= 0 && progress[id]?.total > 0
    ).length;
    const totalScore = Object.values(progress).reduce(
      (sum, { score, total }) => sum + (score / total) * 100,
      0
    );
    const averageScore = completedLessons ? (totalScore / completedLessons).toFixed(2) : 0;
    return { completedLessons, averageScore };
  }, [progress]);

  // Handle clearing progress
  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      setIsClearing(true);
      localStorage.removeItem('progress');
      setProgress({});
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  // Toggle filter for completed lessons
  const toggleFilter = () => {
    setShowCompletedOnly((prev) => !prev);
  };

  // Filter lessons based on completion status
  const filteredLessons = showCompletedOnly
    ? lessons.filter((lesson) => progress[lesson.id]?.score >= 0)
    : lessons;

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    padding: '2rem',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: '"Inter", sans-serif',
  };

  const containerStyle = {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const summaryStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const summaryTextStyle = {
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background 0.3s',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
  };

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  };

  const cardInfoStyle = {
    fontSize: '0.9rem',
    opacity: '0.8',
    marginBottom: '0.5rem',
  };

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '0.5rem',
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    background: '#22c55e',
    transition: 'width 1s ease-in-out',
  });

  const noProgressStyle = {
    textAlign: 'center',
    fontSize: '1.2rem',
    opacity: '0.7',
    marginTop: '2rem',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <motion.h2
          style={headerStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Learning Progress
        </motion.h2>

        {/* Summary Section */}
        <motion.div
          style={summaryStyle}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={summaryTextStyle}>
            <Trophy size={20} />
            Completed Lessons: {summary.completedLessons}/{lessons.length}
          </div>
          <div style={summaryTextStyle}>
            <Trophy size={20} />
            Average Score: {summary.averageScore}%
          </div>
          <div>
            <button
              style={{ ...buttonStyle, backgroundColor: showCompletedOnly ? '#ef4444' : '#06b6d4' }}
              onClick={toggleFilter}
            >
              <Filter size={20} />
              {showCompletedOnly ? 'Show All Lessons' : 'Show Completed Only'}
            </button>
            <button
              style={{ ...buttonStyle, backgroundColor: '#ef4444', marginLeft: '1rem' }}
              onClick={handleClearProgress}
              disabled={isClearing}
            >
              <Trash2 size={20} />
              Clear Progress
            </button>
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <AnimatePresence>
          {filteredLessons.length > 0 ? (
            <motion.div
              style={gridStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredLessons.map((lesson) => {
                const lessonProgress = progress[lesson.id] || { score: 0, total: lesson.quiz.length };
                const percentage = (lessonProgress.score / lessonProgress.total) * 100;

                return (
                  <motion.div
                    key={lesson.id}
                    style={cardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ transform: 'translateY(-5px)' }}
                  >
                    <h3 style={cardTitleStyle}>{lesson.title}</h3>
                    <p style={cardInfoStyle}>Category: {lesson.category}</p>
                    <p style={cardInfoStyle}>Difficulty: {lesson.difficulty}</p>
                    <p style={cardInfoStyle}>
                      Status: {lessonProgress.score >= 0 ? 'Completed' : 'Not Started'}
                    </p>
                    <p style={cardInfoStyle}>
                      Score: {lessonProgress.score}/{lessonProgress.total} ({percentage.toFixed(2)}%)
                    </p>
                    <div style={progressBarStyle}>
                      <motion.div
                        style={progressFillStyle(percentage)}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              style={noProgressStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No completed lessons yet. Start a quiz to track your progress!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Progress;
