import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  FileText, 
  BookOpen, 
  Target, 
  Trophy,
  Clock,
  CheckCircle,
  Star,
  Zap,
  ArrowRight,
  MessageCircle,
  Edit3,
  Save
} from 'lucide-react';

const Practice = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [userLevel, setUserLevel] = useState('Beginner');
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Practice exercises data
  const practiceExercises = [
    {
      id: 1,
      title: 'Daily Conversations',
      description: 'Practice common everyday conversations and greetings',
      level: 'Beginner',
      category: 'Speaking',
      icon: MessageCircle,
      exercises: [
        "Hello! How are you today?",
        "What's your favorite food?",
        "Can you tell me about your family?",
        "What do you do for work?",
        "How was your weekend?"
      ],
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      id: 2,
      title: 'Pronunciation Practice',
      description: 'Focus on difficult English sounds and word pronunciation',
      level: 'Intermediate',
      category: 'Pronunciation',
      icon: Volume2,
      exercises: [
        "The quick brown fox jumps over the lazy dog",
        "She sells seashells by the seashore",
        "How much wood would a woodchuck chuck?",
        "Red lorry, yellow lorry, red lorry, yellow lorry",
        "I scream, you scream, we all scream for ice cream"
      ],
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
    },
    {
      id: 3,
      title: 'Business English',
      description: 'Professional communication and business vocabulary',
      level: 'Advanced',
      category: 'Business',
      icon: Target,
      exercises: [
        "I'd like to schedule a meeting for next week",
        "Could you please send me the quarterly report?",
        "We need to discuss the project timeline",
        "I'm writing to follow up on our previous conversation",
        "Let's brainstorm some innovative solutions"
      ],
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
    },
    {
      id: 4,
      title: 'Storytelling',
      description: 'Practice narrative skills and descriptive language',
      level: 'Intermediate',
      category: 'Creative',
      icon: BookOpen,
      exercises: [
        "Tell me about your most memorable vacation",
        "Describe your dream house in detail",
        "What would you do if you won the lottery?",
        "Tell a story about a time you overcame a challenge",
        "Describe your perfect day from start to finish"
      ],
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)'
    },
    {
      id: 5,
      title: 'Job Interview Prep',
      description: 'Prepare for English job interviews with common questions',
      level: 'Advanced',
      category: 'Professional',
      icon: Trophy,
      exercises: [
        "Tell me about yourself",
        "What are your greatest strengths and weaknesses?",
        "Where do you see yourself in five years?",
        "Why do you want to work for this company?",
        "Describe a challenging situation and how you handled it"
      ],
      gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)'
    },
    {
      id: 6,
      title: 'Vocabulary Building',
      description: 'Expand your vocabulary with advanced words and phrases',
      level: 'Advanced',
      category: 'Vocabulary',
      icon: Edit3,
      exercises: [
        "Use 'serendipity' in a sentence about meeting someone",
        "Describe something as 'ubiquitous' in modern life",
        "Explain what 'ephemeral' means with an example",
        "Use 'juxtaposition' to compare two different things",
        "Describe a 'paradigm shift' in technology"
      ],
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setRecordedText(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Text-to-speech function
  const speak = (textToSpeak = text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Start/stop recording
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setRecordedText('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Complete exercise
  const completeExercise = (exerciseId, exerciseText) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
      
      // Award points if available
      if (window.awardPoints) {
        window.awardPoints('PRACTICE_SUBMITTED');
      }
      
      // Add to history
      const newHistory = {
        id: Date.now(),
        exercise: exerciseText,
        timestamp: new Date().toISOString(),
        score: Math.floor(Math.random() * 30) + 70 // Random score 70-100
      };
      setPracticeHistory([newHistory, ...practiceHistory.slice(0, 9)]);
      setCurrentScore(newHistory.score);
      setShowFeedback(true);
      
      setTimeout(() => setShowFeedback(false), 3000);
    }
  };

  // Get level color
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Styles
  const pageStyle = {
    minHeight: '100vh',
     background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    paddingTop: '80px',
    overflow: 'auto'
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '40px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    color: 'white'
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: '900',
    marginBottom: '15px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const subtitleStyle = {
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    opacity: 0.9,
    marginBottom: '30px',
    lineHeight: '1.5'
  };

  const practiceAreaStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '40px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '120px',
    padding: '16px',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    resize: 'vertical',
    outline: 'none',
    marginBottom: '20px',
    fontFamily: 'inherit'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  };

  const exercisesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px',
    marginTop: '30px'
  };

  const exerciseCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white'
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const statCardStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white'
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    tap: { scale: 0.97 }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header Section */}
        <motion.div
          style={headerStyle}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={titleStyle}>Practice English</h1>
          <p style={subtitleStyle}>
            Improve your speaking skills with interactive exercises and AI feedback
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          style={statsStyle}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Trophy, value: completedExercises.length, label: 'Completed', color: '#fbbf24' },
            { icon: Clock, value: `${practiceHistory.length * 2}min`, label: 'Practice Time', color: '#10b981' },
            { icon: Star, value: practiceHistory.length > 0 ? Math.round(practiceHistory.reduce((acc, h) => acc + h.score, 0) / practiceHistory.length) : 0, label: 'Avg Score', color: '#8b5cf6' },
            { icon: Zap, value: userLevel, label: 'Level', color: '#ef4444' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              style={statCardStyle}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <stat.icon size={32} style={{ color: stat.color, marginBottom: '8px' }} />
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Practice Area */}
        <motion.div
          style={practiceAreaStyle}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>
            Free Practice
          </h3>
          
          <textarea
            style={textareaStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type any English text here to practice pronunciation, or use the microphone to record yourself speaking..."
          />

          {recordedText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <h4 style={{ color: '#10b981', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                Recorded Speech:
              </h4>
              <p style={{ color: 'white', margin: 0, fontSize: '16px' }}>{recordedText}</p>
            </motion.div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <motion.button
              style={primaryButtonStyle}
              onClick={() => speak()}
              disabled={!text || isPlaying}
              whileHover={!text || isPlaying ? {} : { scale: 1.05 }}
              whileTap={!text || isPlaying ? {} : { scale: 0.95 }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Playing...' : 'Play Text'}
            </motion.button>

            <motion.button
              style={{
                ...secondaryButtonStyle,
                background: isRecording ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255, 255, 255, 0.1)'
              }}
              onClick={toggleRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </motion.button>

            {isPlaying && (
              <motion.button
                style={secondaryButtonStyle}
                onClick={stopSpeaking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={20} />
                Stop
              </motion.button>
            )}

            {text && (
              <motion.button
                style={secondaryButtonStyle}
                onClick={() => {
                  completeExercise(Date.now(), text);
                  setText('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save size={20} />
                Save Practice
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Practice Exercises */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h3 
            style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: 'white', textAlign: 'center' }}
            variants={itemVariants}
          >
            Guided Exercises
          </motion.h3>

          <div style={exercisesGridStyle}>
            {practiceExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                style={exerciseCardStyle}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                whileTap={cardHoverVariants.tap}
                onClick={() => setSelectedExercise(exercise)}
              >
                <div style={{ 
                  height: '60px',
                  width: '60px',
                  borderRadius: '15px',
                  background: exercise.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <exercise.icon size={28} color="white" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    {exercise.title}
                  </h4>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: getLevelColor(exercise.level),
                    color: 'white'
                  }}>
                    {exercise.level}
                  </span>
                </div>

                <p style={{ opacity: 0.8, marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
                  {exercise.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>
                    {exercise.exercises.length} exercises
                  </span>
                  {completedExercises.includes(exercise.id) ? (
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                  ) : (
                    <ArrowRight size={20} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feedback Notification */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                zIndex: 1000,
                maxWidth: '300px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <CheckCircle size={24} />
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Great Job!</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Practice completed! Score: {currentScore}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise Modal */}
        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px'
              }}
              onClick={() => setSelectedExercise(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '30px',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                    {selectedExercise.title}
                  </h3>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>

                <p style={{ opacity: 0.8, marginBottom: '25px' }}>
                  {selectedExercise.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedExercise.exercises.map((exerciseText, index) => (
                    <motion.div
                      key={index}
                      style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer'
                      }}
                      whileHover={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      onClick={() => {
                        speak(exerciseText);
                        setText(exerciseText);
                      }}
                    >
                      <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                        <span style={{ flex: 1 }}>{exerciseText}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <motion.button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'white',
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: '8px'
                            }}
                            whileHover={{ background: 'rgba(255, 255, 255, 0.1)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(exerciseText);
                            }}
                          >
                            <Volume2 size={16} />
                          </motion.button>
                          <motion.button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#10b981',
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: '8px'
                            }}
                            whileHover={{ background: 'rgba(16, 185, 129, 0.1)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              completeExercise(selectedExercise.id, exerciseText);
                            }}
                          >
                            <CheckCircle size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .exercise-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 480px) {
          .container-padding {
            padding: 15px !important;
          }
          
          .practice-area {
            padding: 20px !important;
          }
          
          .button-group {
            flex-direction: column !important;
          }
          
          .feedback-notification {
            bottom: 20px !important;
            right: 20px !important;
            left: 20px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Practice;