import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  BookOpen,
  Target,
  Star,
  Clock,
  Trophy,
  Globe,
  Mic,
  Zap,
  CheckCircle,
  Users,
} from "lucide-react";

import { lessons } from '../data/lessons';

// Styles
const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
  paddingTop: '80px',
  overflow: 'auto',
};

const containerStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '20px',
};

const headerStyle = {
  color: 'white',
  marginBottom: '30px',
};

const titleStyle = {
  fontSize: 'clamp(2rem, 6vw, 3.5rem)',
  fontWeight: '900',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
};

const filterStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '20px',
  flexWrap: 'wrap',
};

const filterButtonStyle = {
  padding: '8px 16px',
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const activeFilterStyle = {
  ...filterButtonStyle,
  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  cursor: 'pointer',
};

const cardHeaderStyle = {
  height: '100px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cardContentStyle = {
  padding: '20px',
  color: 'white',
};

const cardTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const descriptionStyle = {
  fontSize: '14px',
  opacity: 0.8,
  marginBottom: '15px',
  lineHeight: '1.5',
};

const statsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '12px',
  opacity: 0.8,
};

const statItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

const difficultyBadgeStyle = (difficulty) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  padding: '5px 12px',
  borderRadius: '15px',
  fontSize: '12px',
  fontWeight: 'bold',
  background:
    difficulty === 'Beginner'
      ? 'rgba(34, 197, 94, 0.8)'
      : difficulty === 'Intermediate'
      ? 'rgba(251, 191, 36, 0.8)'
      : 'rgba(239, 68, 68, 0.8)',
  backdropFilter: 'blur(10px)',
});

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

const cardVariants = {
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

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Lessons = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(lessons.map((lesson) => lesson.category))];
  const filteredLessons =
    filter === 'All' ? lessons : lessons.filter((lesson) => lesson.category === filter);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div style={headerStyle}>
            <h1 style={titleStyle}>Lessons</h1>
            <div style={filterStyle}>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  style={filter === category ? activeFilterStyle : filterButtonStyle}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setFilter(category)}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
          <motion.div style={gridStyle} variants={containerVariants}>
            {filteredLessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                style={cardStyle}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/lessons/${lesson.id}`)}
              >
                <div style={{ ...cardHeaderStyle, background: lesson.gradient }}>
                  <lesson.icon size={40} color="white" />
                  <div style={difficultyBadgeStyle(lesson.difficulty)}>{lesson.difficulty}</div>
                  {lesson.completed && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(34, 197, 94, 0.9)',
                        borderRadius: '50%',
                        padding: '5px',
                      }}
                    >
                      <CheckCircle size={16} />
                    </div>
                  )}
                </div>
                <div style={cardContentStyle}>
                  <h3 style={cardTitleStyle}>{lesson.title}</h3>
                  <p style={descriptionStyle}>{lesson.description}</p>
                  <div style={statsStyle}>
                    <span style={statItemStyle}>
                      <Clock size={14} />
                      {lesson.duration}
                    </span>
                    <span style={statItemStyle}>
                      <Users size={14} />
                      {lesson.students.toLocaleString()}
                    </span>
                    <span style={statItemStyle}>
                      <Star size={14} />
                      {lesson.rating}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          .title {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
          }
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }
        @media (max-width: 480px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .filter {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Lessons;