import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Trash2, Filter, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';
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
      (id) => progress[id]?.score >= 0 && (progress[id].score / progress[id].total) >= 0.7
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
    ? lessons.filter((lesson) => {
        const lessonProgress = progress[lesson.id];
        return lessonProgress && (lessonProgress.score / lessonProgress.total) >= 0.7;
      })
    : lessons;

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    padding: '2rem 0',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: '"Inter", sans-serif',
    boxSizing: 'border-box',
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '1400px',
    padding: '0 20px',
    margin: '0 auto',
    boxSizing: 'border-box',
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const summaryStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2.5rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const summaryTextStyle = {
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: '600',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const buttonStyle = {
    padding: '1rem 1.75rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '10px',
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(15px)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
    transition: 'all 0.4s ease',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const cardTitleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#fff',
    lineHeight: '1.3',
  };

  const cardInfoStyle = {
    fontSize: '1rem',
    opacity: '0.9',
    marginBottom: '0.75rem',
    color: '#fff',
    lineHeight: '1.4',
  };

  const progressBarStyle = {
    width: '100%',
    height: '12px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '6px',
    overflow: 'hidden',
    marginTop: '1rem',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    background: 'linear-gradient(90deg, #10b981, #059669)',
    transition: 'width 1.5s ease-in-out',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
    borderRadius: '6px',
  });

  const noProgressStyle = {
    textAlign: 'center',
    fontSize: '1.5rem',
    opacity: '0.7',
    marginTop: '2rem',
    color: '#fff',
    lineHeight: '1.5',
  };

  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 768px) {
          .page-container {
            padding: 1.5rem 0 !important;
          }
          .container {
            padding: 0 15px !important;
          }
          .header {
            font-size: 2rem !important;
          }
          .summary {
            padding: 1.5rem !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .summary-text {
            font-size: 1.1rem !important;
          }
          .button-container {
            flex-direction: column !important;
            width: 100% !important;
            gap: 0.75rem !important;
          }
          .button {
            padding: 0.9rem 1.25rem !important;
            font-size: 0.9rem !important;
            width: 100% !important;
            justify-content: center !important;
          }
          .grid-container {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .card {
            padding: 2rem !important;
            min-height: 280px !important;
          }
          .card-title {
            font-size: 1.4rem !important;
          }
          .card-info {
            font-size: 0.95rem !important;
          }
        }
        @media (max-width: 480px) {
          .page-container {
            padding: 1rem 0 !important;
          }
          .container {
            padding: 0 10px !important;
          }
          .header {
            font-size: 1.75rem !important;
          }
          .summary {
            padding: 1.25rem !important;
          }
          .summary-text {
            font-size: 1rem !important;
          }
          .button {
            padding: 0.8rem 1rem !important;
            font-size: 0.85rem !important;
          }
          .card {
            padding: 1.5rem !important;
            min-height: 260px !important;
          }
          .card-title {
            font-size: 1.25rem !important;
          }
          .card-info {
            font-size: 0.9rem !important;
          }
        }
        .card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3) !important;
        }
        .button:hover {
          background-color: #0e7490 !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
          transform: translateY(-2px) !important;
        }
        .button:disabled {
          background-color: #6b7280 !important;
          cursor: not-allowed !important;
          opacity: 0.7 !important;
        }
        .clear-button:hover {
          background-color: #dc2626 !important;
        }
        .tooltip {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .status-container:hover .tooltip {
          opacity: 1;
        }
      `}</style>

      <div style={pageStyle} className="page-container">
        <div style={containerStyle} className="container">
          <motion.h2
            style={headerStyle}
            className="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Learning Progress
          </motion.h2>

          {/* Summary Section */}
          <motion.div
            style={summaryStyle}
            className="summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div style={summaryTextStyle} className="summary-text">
              <Trophy size={24} />
              Completed Lessons: {summary.completedLessons}/{lessons.length}
            </div>
            <div style={summaryTextStyle} className="summary-text">
              <Trophy size={24} />
              Average Score: {summary.averageScore}%
            </div>
            <div style={buttonContainerStyle} className="button-container">
              <motion.button
                style={{ ...buttonStyle, backgroundColor: showCompletedOnly ? '#ef4444' : '#06b6d4' }}
                className="button"
                onClick={toggleFilter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={showCompletedOnly ? 'Show all lessons' : 'Show completed lessons only'}
              >
                <Filter size={20} />
                {showCompletedOnly ? 'Show All Lessons' : 'Show Completed Only'}
              </motion.button>
              <motion.button
                style={{ ...buttonStyle, backgroundColor: '#ef4444' }}
                className="button clear-button"
                onClick={handleClearProgress}
                disabled={isClearing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Clear all progress"
              >
                <Trash2 size={20} />
                Clear Progress
              </motion.button>
            </div>
          </motion.div>

          {/* Lessons Grid */}
          <AnimatePresence>
            {filteredLessons.length > 0 ? (
              <motion.div
                style={gridStyle}
                className="grid-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredLessons.map((lesson) => {
                  const lessonProgress = progress[lesson.id] || { score: 0, total: lesson.quiz.length };
                  const percentage = (lessonProgress.score / lessonProgress.total) * 100;
                  const isCompleted = lessonProgress.score >= 0 && percentage >= 70;
                  const isInProgress = lessonProgress.score >= 0 && percentage < 70;
                  const status = isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started';
                  const statusColor = isCompleted ? '#10b981' : isInProgress ? '#fbbf24' : '#6b7280';
                  const statusIcon = isCompleted ? CheckCircle : isInProgress ? Clock : XCircle;
                  const StatusIcon = statusIcon;

                  return (
                    <motion.div
                      key={lesson.id}
                      style={cardStyle}
                      className="card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ transform: 'translateY(-8px)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={cardTitleStyle} className="card-title">{lesson.title}</h3>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <StatusIcon size={24} style={{ color: statusColor }} />
                        </motion.div>
                      </div>
                      <p style={cardInfoStyle} className="card-info">Category: <span style={{ color: '#fbbf24' }}>{lesson.category}</span></p>
                      <p style={cardInfoStyle} className="card-info">Difficulty: <span style={{ color: '#f59e0b' }}>{lesson.difficulty}</span></p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="status-container">
                        <p style={{ ...cardInfoStyle, marginBottom: '0.75rem' }} className="card-info">
                          Status: <span style={{ color: statusColor, fontWeight: '600' }}>{status}</span>
                        </p>
                        {isInProgress && (
                          <span className="tooltip">
                            Need {(0.7 * lessonProgress.total - lessonProgress.score).toFixed(1)} more points to complete
                          </span>
                        )}
                      </div>
                      <p style={cardInfoStyle} className="card-info">
                        Score: <span style={{ color: '#fbbf24', fontWeight: '600' }}>{lessonProgress.score}/{lessonProgress.total} ({percentage.toFixed(2)}%)</span>
                      </p>
                      <div style={progressBarStyle}>
                        <motion.div
                          style={progressFillStyle(percentage)}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.5, ease: 'easeInOut' }}
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
    </>
  );
};

export default Progress;