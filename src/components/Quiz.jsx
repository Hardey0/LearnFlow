
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy,CheckCircle, XCircle, Clock, ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';
import { lessons } from '../data/lessons';

const Quiz = () => {
  const { id } = useParams();
  const location = useLocation();
  const lesson = useMemo(() => {
    const foundLesson = lessons.find((l) => l.id === parseInt(id));
    console.log('Quiz ID:', id, 'Location:', location.pathname, 'Found lesson:', foundLesson);
    return foundLesson;
  }, [id]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeout, setIsTimeout] = useState(false);
  const [questionTransition, setQuestionTransition] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Styles defined at the top to avoid ReferenceError
  const errorStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
    padding: '20px',
  };

  const backButtonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  // Reset state when lesson ID changes
  useEffect(() => {
    console.log('Resetting state for lesson ID:', id);
    setIsLoading(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowResults(false);
    setTimeLeft(30);
    setIsTimeout(false);
    setQuestionTransition(false);
    setError(null);
    setIsLoading(false);
  }, [id]);

  // Prevent browser reload during quiz
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!showResults) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showResults]);

  // Timer logic
  useEffect(() => {
    if (!lesson || !lesson.quiz || lesson.quiz.length === 0 || showResults || questionTransition) return;

    console.log('Timer started. Question:', currentQuestion + 1, 'Time left:', timeLeft);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeout(true);
          setIsCorrect(false);
          setSelectedOption(null);
          console.log('Timeout for question:', currentQuestion + 1);
          setQuestionTransition(true);
          setTimeout(() => {
            if (currentQuestion < lesson.quiz.length - 1) {
              setCurrentQuestion((prev) => {
                const next = prev + 1;
                console.log('Moving to question:', next + 1);
                return next;
              });
              setTimeLeft(30);
              setIsTimeout(false);
              setIsCorrect(null);
              setQuestionTransition(false);
            } else {
              setShowResults(true);
              console.log('Quiz completed. Score:', score, 'Show results:', true);
              setQuestionTransition(false);
            }
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, lesson, showResults, questionTransition, score]);

  const handleAnswer = (index, event) => {
    event.preventDefault();
    if (selectedOption !== null || isTimeout || questionTransition) return;

    console.log('Selected option:', index, 'for question:', currentQuestion + 1, 'Correct answer:', lesson.quiz[currentQuestion].correct);

    setSelectedOption(index);
    const isAnswerCorrect = index === lesson.quiz[currentQuestion].correct;
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) setScore((prev) => prev + 1);

    setQuestionTransition(true);
    setTimeout(() => {
      if (currentQuestion < lesson.quiz.length - 1) {
        setCurrentQuestion((prev) => {
          const next = prev + 1;
          console.log('Moving to question:', next + 1);
          return next;
        });
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(30);
        setIsTimeout(false);
        setQuestionTransition(false);
      } else {
        const finalScore = score + (isAnswerCorrect ? 1 : 0);
        setShowResults(true);
        localStorage.setItem('progress', JSON.stringify({
          ...JSON.parse(localStorage.getItem('progress') || '{}'),
          [lesson.id]: { score: finalScore, total: lesson.quiz.length },
        }));
        console.log('Quiz completed. Final score:', finalScore);
        setQuestionTransition(false);
      }
    }, 2000);
  };

  const handleRestart = () => {
    console.log('Restarting quiz for lesson ID:', id);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowResults(false);
    setTimeLeft(30);
    setIsTimeout(false);
    setQuestionTransition(false);
    setError(null);
  };

  // Validate lesson and quiz data
  if (!lesson || !lesson.quiz || lesson.quiz.length === 0) {
    console.error('Invalid lesson or quiz data for ID:', id, 'Lesson:', lesson);
    return (
      <div style={errorStyle}>
        <h2>Quiz Not Found</h2>
        <p>Could not find a valid quiz for lesson ID {id}. Please try another lesson.</p>
        <Link to="/lessons" style={backButtonStyle}>Back to Lessons</Link>
      </div>
    );
  }

  // Error boundary for rendering issues
  if (error) {
    return (
      <div style={errorStyle}>
        <h2>Error Loading Quiz</h2>
        <p>An error occurred while loading the quiz for lesson ID {id}: {error}. Please try again.</p>
        <Link to="/lessons" style={backButtonStyle}>Back to Lessons</Link>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={errorStyle}>
        <h2>Loading Quiz...</h2>
        <p>Loading quiz for lesson ID {id}. Please wait.</p>
      </div>
    );
  }

  console.log('Rendering. Current question:', currentQuestion + 1, 'Show results:', showResults, 'Score:', score, 'Lesson title:', lesson.title);

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

  const quizContainerStyle = {
    maxWidth: '600px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const questionStyle = {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  const optionsStyle = {
    display: 'grid',
    gap: '1rem',
    marginBottom: '1rem',
  };

  const optionStyle = (index) => ({
    padding: '1rem',
    background:
      selectedOption === index
        ? isCorrect
          ? 'rgba(34, 197, 94, 0.3)'
          : 'rgba(239, 68, 68, 0.3)'
        : 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    cursor: selectedOption === null && !isTimeout ? 'pointer' : 'not-allowed',
    transition: 'background 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.1rem',
  });

  const feedbackStyle = {
    marginTop: '1rem',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center',
    color: isCorrect ? '#22c55e' : '#ef4444',
  };

  const progressBarStyle = {
    width: '100%',
    height: '10px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '1rem',
  };

  const progressFillStyle = {
    width: `${((currentQuestion + 1) / lesson.quiz.length) * 100}%`,
    height: '100%',
    background: '#06b6d4',
    transition: 'width 0.3s ease-in-out',
  };

  const timerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontSize: '1.1rem',
    color: timeLeft <= 10 ? '#ef4444' : '#fff',
  };

  const scoreStyle = {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    textAlign: 'center',
  };

  const resultsStyle = {
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const buttonStyle = {
    margin: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    border: 'none',
  };

  return (
    <div style={pageStyle}>
      {!showResults ? (
        <motion.div
          style={quizContainerStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
            {lesson.title} Quiz
          </h2>
          <div style={scoreStyle}>Score: {score}/{lesson.quiz.length}</div>
          <div style={progressBarStyle}>
            <motion.div style={progressFillStyle} />
          </div>
          <div style={timerStyle}>
            <Clock size={20} />
            Time Left: {timeLeft}s
          </div>
          <div style={questionStyle}>
            Question {currentQuestion + 1} of {lesson.quiz.length}: {lesson.quiz[currentQuestion].question}
          </div>
          <div style={optionsStyle}>
            {lesson.quiz[currentQuestion].options.map((option, index) => (
              <motion.div
                key={`${id}-${currentQuestion}-${index}`}
                style={optionStyle(index)}
                onClick={(e) => {
                  try {
                    handleAnswer(index, e);
                  } catch (err) {
                    console.error('Error in handleAnswer:', err);
                    setError(err.message);
                  }
                }}
                whileHover={selectedOption === null && !isTimeout ? { scale: 1.02 } : {}}
                whileTap={selectedOption === null && !isTimeout ? { scale: 0.98 } : {}}
              >
                {option}
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {selectedOption !== null && isCorrect && (
              <motion.div
                style={feedbackStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={20} /> Correct!
              </motion.div>
            )}
            {selectedOption !== null && !isCorrect && (
              <motion.div
                style={feedbackStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <XCircle size={20} /> Incorrect! The correct answer is: {lesson.quiz[currentQuestion].options[lesson.quiz[currentQuestion].correct]}
              </motion.div>
            )}
            {isTimeout && (
              <motion.div
                style={feedbackStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Clock size={20} /> Time's up! The correct answer was: {lesson.quiz[currentQuestion].options[lesson.quiz[currentQuestion].correct]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          style={resultsStyle}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Quiz Completed!</h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Final Score: {score}/{lesson.quiz.length} ({((score / lesson.quiz.length) * 100).toFixed(2)}%)
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/lessons" style={buttonStyle}>
              <ArrowLeft size={20} /> Back to Lessons
            </Link>
            <Link to="/progress" style={buttonStyle}>
              <Trophy size={20} /> View Progress
            </Link>
            <button onClick={handleRestart} style={buttonStyle}>
              <RefreshCw size={20} /> Restart Quiz
            </button>
            {parseInt(id) < lessons.length && (
              <Link to={`/quiz/${parseInt(id) + 1}`} style={buttonStyle}>
                <ArrowRight size={20} /> Next Quiz
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;
