
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Trophy, Globe, BookOpen, Mic, Zap, Clock, Star, Users, Play, CheckCircle, ArrowLeft } from 'lucide-react';
import { lessons } from '../data/lessons';

const LessonDetail = () => {
  const { id } = useParams();
  const lesson = lessons.find((l) => l.id === parseInt(id));
  const [currentSentence, setCurrentSentence] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('ID from params:', id);
    console.log('Parsed ID:', parseInt(id));
    console.log('Found lesson:', lesson);
  }, [id, lesson]);

  // Styles (moved to top)
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
    paddingBottom: '40px',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    color: 'white',
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: '900',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  };

  const backButtonStyle = {
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const contentStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: '0',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  };

  const cardHeaderStyle = {
    height: '120px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    background: lesson?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
  };

  const cardContentStyle = {
    padding: '0 25px 25px 25px',
    color: 'white',
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
    marginBottom: '15px',
    fontSize: '14px',
    opacity: 0.8,
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  };

  const difficultyBadgeStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    padding: '5px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold',
    background: lesson
      ? lesson.difficulty === 'Beginner'
        ? 'rgba(34, 197, 94, 0.8)'
        : lesson.difficulty === 'Intermediate'
        ? 'rgba(251, 191, 36, 0.8)'
        : 'rgba(239, 68, 68, 0.8)'
      : 'rgba(239, 68, 68, 0.8)',
    backdropFilter: 'blur(10px)',
  };

  const videoSectionStyle = {
    marginBottom: '15px',
  };

  const videoButtonStyle = {
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
  };

  const sentenceSectionStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '15px',
  };

  const sentenceStyle = {
    fontSize: 'clamp(16px, 3vw, 18px)',
    fontWeight: '500',
    marginBottom: '15px',
    lineHeight: '1.5',
  };

  const buttonStyle = {
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const skillsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '15px',
  };

  const skillTagStyle = {
    padding: '4px 10px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  };

  const progressBarStyle = {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '15px',
  };

  const quizLinkStyle = {
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    textDecoration: 'none',
    width: '100%',
  };

  const errorStyle = {
    textAlign: 'center',
    fontSize: '18px',
    color: 'white',
    padding: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  };

  const channelStyle = {
    fontSize: '12px',
    opacity: 0.7,
    marginBottom: '15px',
    fontStyle: 'italic',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const modalContentStyle = {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    position: 'relative',
  };

  const modalHeaderStyle = {
    padding: '20px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const modalTitleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  };

  const modalSubtitleStyle = {
    margin: '5px 0 0 0',
    opacity: 0.9,
    fontSize: '14px',
  };

  const modalCloseButtonStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const videoContainerStyle = {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
  };

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  };

  const modalBodyStyle = {
    padding: '20px',
  };

  const modalDescriptionStyle = {
    margin: '0 0 15px 0',
    color: '#333',
    lineHeight: '1.6',
  };

  const modalSkillsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '15px',
  };

  const modalSkillTagStyle = {
    padding: '4px 12px',
    background: '#f0f0f0',
    borderRadius: '15px',
    fontSize: '12px',
    color: '#666',
    fontWeight: '500',
  };

  const modalWatchButtonStyle = {
    padding: '12px 24px',
    background: lesson?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  };

  // Animation variants
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

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Fallback content
  const lessonContent = lesson?.content || [
    `Practice key phrases for ${lesson?.title || 'this lesson'}.`,
    `Apply ${lesson?.title || 'these concepts'} in conversations.`,
    `Review and reinforce ${lesson?.title || 'your skills'}.`,
  ];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // Video Modal
  const VideoModal = ({ video, onClose }) => {
    if (!video) return null;

    const embedUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`;

    return (
      <AnimatePresence>
        <motion.div
          style={modalOverlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            style={modalContentStyle}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ ...modalHeaderStyle, background: video.gradient }}>
              <div>
                <h3 style={modalTitleStyle}>{video.title}</h3>
                <p style={modalSubtitleStyle}>
                  📺 {video.channel} • {video.duration}
                </p>
              </div>
              <motion.button
                style={modalCloseButtonStyle}
                whileHover={{ background: 'rgba(255, 255, 255, 0.3)' }}
                onClick={onClose}
              >
                ✕
              </motion.button>
            </div>
            <div style={videoContainerStyle}>
              <iframe
                src={embedUrl}
                style={iframeStyle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </div>
            <div style={modalBodyStyle}>
              <p style={modalDescriptionStyle}>{video.description}</p>
              <div style={modalSkillsStyle}>
                {video.skills.map((skill) => (
                  <span key={skill} style={modalSkillTagStyle}>
                    {skill}
                  </span>
                ))}
              </div>
              <motion.button
                style={{ ...modalWatchButtonStyle }}
                whileHover={{ scale: 1.02 }}
                onClick={() => window.open(video.videoUrl, '_blank')}
              >
                Watch on YouTube
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (!lesson) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={errorStyle}
          >
            Lesson not found
            <Link to="/lessons" style={backButtonStyle}>
              <ArrowLeft size={16} />
              Back to Lessons
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div style={headerStyle} variants={itemVariants}>
            <Link to="/lessons" style={backButtonStyle}>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <ArrowLeft size={16} />
                Back to Lessons
              </motion.div>
            </Link>
            <h1 style={titleStyle}>{lesson.title}</h1>
          </motion.div>

          {/* Main Content */}
          <motion.div style={contentStyle} variants={itemVariants}>
            {/* Card Header */}
            <div style={cardHeaderStyle}>
              <lesson.icon size={48} color="white" />
              <div style={difficultyBadgeStyle}>{lesson.difficulty}</div>
              {lesson.completed && (
                <div
                  style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    background: 'rgba(34, 197, 94, 0.9)',
                    borderRadius: '50%',
                    padding: '5px',
                  }}
                >
                  <CheckCircle size={16} />
                </div>
              )}
            </div>

            {/* Card Content */}
            <div style={cardContentStyle}>
              <p style={descriptionStyle}>{lesson.description}</p>

              {/* Channel Info */}
              {lesson.channel && (
                <div style={channelStyle}>📺 Channel: {lesson.channel}</div>
              )}

              {/* Stats */}
              <div style={statsStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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

              {/* Skills */}
              <motion.div style={skillsStyle} variants={itemVariants}>
                {lesson.skills.map((skill) => (
                  <span key={skill} style={skillTagStyle}>
                    {skill}
                  </span>
                ))}
              </motion.div>

              {/* Video Section */}
              <motion.div style={videoSectionStyle} variants={itemVariants}>
                <motion.button
                  style={videoButtonStyle}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowVideoModal(true)}
                >
                  <Play size={16} />
                  Watch Lesson Video
                </motion.button>
              </motion.div>

              {/* Sentence Practice */}
              <motion.div style={sentenceSectionStyle} variants={itemVariants}>
                <motion.p style={sentenceStyle} variants={itemVariants}>
                  {lessonContent[currentSentence]}
                </motion.p>
                <motion.button
                  style={buttonStyle}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => speak(lessonContent[currentSentence])}
                >
                  <Play size={16} />
                  Play Sentence
                </motion.button>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <motion.button
                    style={currentSentence === 0 ? disabledButtonStyle : buttonStyle}
                    variants={buttonVariants}
                    whileHover={currentSentence === 0 ? {} : 'hover'}
                    whileTap={currentSentence === 0 ? {} : 'tap'}
                    onClick={() => setCurrentSentence((prev) => Math.max(0, prev - 1))}
                    disabled={currentSentence === 0}
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    style={
                      currentSentence === lessonContent.length - 1
                        ? disabledButtonStyle
                        : buttonStyle
                    }
                    variants={buttonVariants}
                    whileHover={currentSentence === lessonContent.length - 1 ? {} : 'hover'}
                    whileTap={currentSentence === lessonContent.length - 1 ? {} : 'tap'}
                    onClick={() =>
                      setCurrentSentence((prev) => Math.min(lessonContent.length - 1, prev + 1))
                    }
                    disabled={currentSentence === lessonContent.length - 1}
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>

              {/* Progress Bar */}
              <motion.div style={progressBarStyle} variants={itemVariants}>
                <motion.div
                  style={{
                    height: '100%',
                    background: lesson.completed
                      ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                      : 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                    borderRadius: '3px',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${lesson.progress}%` }}
                  transition={{ duration: 1 }}
                />
              </motion.div>
              <div
                style={{
                  fontSize: '12px',
                  opacity: 0.7,
                  marginTop: '10px',
                }}
              >
                {lesson.progress}% Complete
              </div>

              {/* Quiz Link */}
              <motion.div variants={itemVariants}>
                <Link to={`/quiz/${lesson.id}`} style={quizLinkStyle}>
                  <BookOpen size={16} />
                  Take Quiz
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {showVideoModal && <VideoModal video={lesson} onClose={() => setShowVideoModal(false)} />}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          .title {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
          }
          .content {
            padding: 0;
          }
          .sentence-section {
            padding: 15px;
          }
          .stats {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }
        @media (max-width: 480px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .video-button, .sentence-button, .quiz-link {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
          .sentence-section div {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonDetail;
