
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trophy, Edit, Trash2, Upload, BookOpen, Users, BarChart3, Settings, LogOut, Search, Download, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalLessons: 0, totalUsers: 0, totalQuizzes: 0, avgScore: 0 });
  const [activeTab, setActiveTab] = useState('lessons');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    duration: '',
    videoUrl: '',
    videoId: '',
    channel: '',
    content: [''],
    quiz: [{ question: '', options: ['', '', '', ''], correct: 0 }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedLessons = JSON.parse(localStorage.getItem('adminLessons') || '[]');
    setLessons(storedLessons);

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
    setUsers([...allUsers, ...allAdmins]);

    const totalLessons = storedLessons.length;
    const totalUsers = [...allUsers, ...allAdmins].length;
    const progressData = JSON.parse(localStorage.getItem('progress') || '{}');
    const totalQuizzes = Object.keys(progressData).length;
    const avgScore = Object.values(progressData).reduce((sum, p) => sum + p.score, 0) / totalQuizzes || 0;
    setStats({ totalLessons, totalUsers, totalQuizzes, avgScore: (avgScore * 100).toFixed(1) });
  }, []);

  // Save lessons to localStorage
  const saveLessons = (updatedLessons) => {
    localStorage.setItem('adminLessons', JSON.stringify(updatedLessons));
    setLessons(updatedLessons);
    const mainLessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    const updatedMainLessons = mainLessons.map((mainLesson) => {
      const adminLesson = updatedLessons.find((l) => l.id === mainLesson.id);
      return adminLesson ? { ...mainLesson, ...adminLesson } : mainLesson;
    });
    localStorage.setItem('lessons', JSON.stringify(updatedMainLessons));
  };

  // Add new lesson
  const handleAddLesson = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const lessonId = Date.now();
      const newLessonData = {
        id: lessonId,
        title: newLesson.title,
        description: newLesson.description,
        category: newLesson.category,
        difficulty: newLesson.difficulty,
        duration: newLesson.duration,
        completed: false,
        progress: 0,
        rating: 4.5,
        students: 0,
        icon: BookOpen,
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        skills: [newLesson.category, newLesson.difficulty],
        videoUrl: newLesson.videoUrl,
        videoId: newLesson.videoId,
        channel: newLesson.channel,
        content: newLesson.content.filter(c => c.trim() !== ''),
        quiz: newLesson.quiz.filter(q => q.question.trim() !== ''),
      };
      const updatedLessons = [...lessons, newLessonData];
      saveLessons(updatedLessons);
      setNewLesson({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        duration: '',
        videoUrl: '',
        videoId: '',
        channel: '',
        content: [''],
        quiz: [{ question: '', options: ['', '', '', ''], correct: 0 }],
      });
      setIsLoading(false);
    }, 500);
  };

  // Edit lesson
  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setNewLesson({
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      difficulty: lesson.difficulty,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
      videoId: lesson.videoId,
      channel: lesson.channel,
      content: lesson.content || [''],
      quiz: lesson.quiz || [{ question: '', options: ['', '', '', ''], correct: 0 }],
    });
  };

  // Update lesson
  const handleUpdateLesson = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const updatedLesson = {
        ...editingLesson,
        title: newLesson.title,
        description: newLesson.description,
        category: newLesson.category,
        difficulty: newLesson.difficulty,
        duration: newLesson.duration,
        videoUrl: newLesson.videoUrl,
        videoId: newLesson.videoId,
        channel: newLesson.channel,
        content: newLesson.content.filter(c => c.trim() !== ''),
        quiz: newLesson.quiz.filter(q => q.question.trim() !== ''),
      };
      const updatedLessons = lessons.map((l) => (l.id === editingLesson.id ? updatedLesson : l));
      saveLessons(updatedLessons);
      setEditingLesson(null);
      setNewLesson({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        duration: '',
        videoUrl: '',
        videoId: '',
        channel: '',
        content: [''],
        quiz: [{ question: '', options: ['', '', '', ''], correct: 0 }],
      });
      setIsLoading(false);
    }, 500);
  };

  // Delete lesson
  const handleDeleteLesson = (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      const updatedLessons = lessons.filter((l) => l.id !== lessonId);
      saveLessons(updatedLessons);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('currentAdmin');
    navigate('/');
  };

  // Export data
  const handleExportData = () => {
    setExporting(true);
    const data = {
      lessons: lessons,
      users: JSON.parse(localStorage.getItem('users') || '[]'),
      admins: JSON.parse(localStorage.getItem('admins') || '[]'),
      progress: JSON.parse(localStorage.getItem('progress') || '{}'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  // Search lessons
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    padding: '1.5rem',
    color: '#fff',
    fontFamily: '"Inter", sans-serif',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  };

  const navTabStyle = {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  };

  const tabButtonStyle = (active) => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: active ? '#06b6d4' : 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  });

  const searchStyle = {
    position: 'relative',
    maxWidth: '300px',
    marginBottom: '1.5rem',
  };

  const searchInputStyle = {
    width: '100%',
    padding: '0.75rem 3rem 0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
  };

  const searchIconStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.5)',
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const statCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '1.5rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const formStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const inputStyle = {
    width: '100%',
    padding: '1.25rem',
    margin: '0.5rem 0',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '100px',
    resize: 'vertical',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginTop: '0.75rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const lessonCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const lessonTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    cursor: 'pointer',
  };

  const lessonInfoStyle = {
    fontSize: '0.9rem',
    opacity: '0.8',
    marginBottom: '0.75rem',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.25rem',
  };

  const actionButtonStyle = (type) => ({
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: type === 'edit' ? '#06b6d4' : '#ef4444',
    color: '#fff',
    fontSize: '14px',
    transition: 'background 0.3s',
  });

  const exportButtonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#22c55e',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '1.5rem',
  };

  const tabContentStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .page-container { padding: 1rem !important; }
          .header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .title { font-size: 1.5rem !important; }
          .nav-tabs { gap: 0.5rem !important; }
          .tab-button { padding: 0.5rem 1rem !important; font-size: 14px !important; }
          .form-container { padding: 1rem !important; }
          .input-field, .textarea-field { padding: 1rem !important; font-size: 14px !important; margin: 0.5rem 0 !important; }
          .button { margin-top: 1rem !important; padding: 0.5rem 1rem !important; font-size: 14px !important; }
          .action-buttons { gap: 1rem !important; }
          .delete-button { width: 48px !important; height: 48px !important; }
          .content-section, .quiz-section { margin-bottom: 1rem !important; }
          .grid-container { grid-template-columns: 1fr !important; }
          .search-container { max-width: 100% !important; }
        }
        @media (max-width: 480px) {
          .page-container { padding: 0.75rem !important; }
          .title { font-size: 1.3rem !important; }
          .form-container { padding: 0.75rem !important; }
          .input-field, .textarea-field { padding: 0.75rem !important; font-size: 13px !important; }
          .button { padding: 0.5rem 0.75rem !important; font-size: 13px !important; }
          .lesson-card { padding: 1rem !important; }
          .action-buttons { gap: 0.75rem !important; }
          .delete-button { width: 44px !important; height: 44px !important; }
          .tab-content { padding: 1rem !important; }
        }
        .button:hover { background-color: #0891b2; }
        .action-button:hover { background-color: #0891b2; }
        .action-button.delete:hover { background-color: #dc2626; }
        .input-field:focus, .textarea-field:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.5) !important;
        }
      `}</style>

      <div style={pageStyle} className="page-container">
        <div style={containerStyle}>
          <div style={headerStyle} className="header">
            <h1 style={titleStyle} className="title">Admin Dashboard</h1>
            <button style={buttonStyle} onClick={handleLogout} className="button">
              <LogOut size={20} /> Logout
            </button>
          </div>

          {/* Stats Overview */}
          <motion.div style={statsContainerStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid-container">
            <div style={statCardStyle}>
              <BookOpen size={32} style={{ color: '#06b6d4' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.totalLessons}</h3>
              <p style={{ opacity: 0.8 }}>Total Lessons</p>
            </div>
            <div style={statCardStyle}>
              <Users size={32} style={{ color: '#06b6d4' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.totalUsers}</h3>
              <p style={{ opacity: 0.8 }}>Total Users</p>
            </div>
            <div style={statCardStyle}>
              <BarChart3 size={32} style={{ color: '#06b6d4' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.totalQuizzes}</h3>
              <p style={{ opacity: 0.8 }}>Completed Quizzes</p>
            </div>
            <div style={statCardStyle}>
              <Trophy size={32} style={{ color: '#06b6d4' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.avgScore}%</h3>
              <p style={{ opacity: 0.8 }}>Average Score</p>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={navTabStyle} className="nav-tabs">
              <button
                style={tabButtonStyle(activeTab === 'lessons')}
                onClick={() => setActiveTab('lessons')}
                className="tab-button"
              >
                Lessons
              </button>
              <button
                style={tabButtonStyle(activeTab === 'users')}
                onClick={() => setActiveTab('users')}
                className="tab-button"
              >
                Users
              </button>
              <button
                style={tabButtonStyle(activeTab === 'stats')}
                onClick={() => setActiveTab('stats')}
                className="tab-button"
              >
                Statistics
              </button>
              <button
                style={tabButtonStyle(activeTab === 'settings')}
                onClick={() => setActiveTab('settings')}
                className="tab-button"
              >
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            style={tabContentStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            {activeTab === 'lessons' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '600' }}>Lesson Management</h2>
                  <button style={exportButtonStyle} onClick={handleExportData} disabled={exporting} className="button">
                    <Download size={20} /> Export Data
                  </button>
                </div>
                <div style={searchStyle} className="search-container">
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchInputStyle}
                    className="input-field"
                  />
                  <Search size={20} style={searchIconStyle} />
                </div>
                <form style={formStyle} onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson} className="form-container">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                    {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }} className="grid-container">
                    <input
                      type="text"
                      placeholder="Title"
                      value={editingLesson ? editingLesson.title : newLesson.title}
                      onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, title: e.target.value }) : setNewLesson({ ...newLesson, title: e.target.value })}
                      required
                      style={inputStyle}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 15 min)"
                      value={editingLesson ? editingLesson.duration : newLesson.duration}
                      onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, duration: e.target.value }) : setNewLesson({ ...newLesson, duration: e.target.value })}
                      required
                      style={inputStyle}
                      className="input-field"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={editingLesson ? editingLesson.description : newLesson.description}
                    onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, description: e.target.value }) : setNewLesson({ ...newLesson, description: e.target.value })}
                    required
                    style={textareaStyle}
                    className="textarea-field"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }} className="grid-container">
                    <input
                      type="text"
                      placeholder="Category"
                      value={editingLesson ? editingLesson.category : newLesson.category}
                      onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, category: e.target.value }) : setNewLesson({ ...newLesson, category: e.target.value })}
                      required
                      style={inputStyle}
                      className="input-field"
                    />
                    <select
                      value={editingLesson ? editingLesson.difficulty : newLesson.difficulty}
                      onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, difficulty: e.target.value }) : setNewLesson({ ...newLesson, difficulty: e.target.value })}
                      style={inputStyle}
                      className="input-field"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }} className="grid-container">
                    <input
                      type="text"
                      placeholder="Video URL"
                      value={editingLesson ? editingLesson.videoUrl : newLesson.videoUrl}
                      onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, videoUrl: e.target.value }) : setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                      style={inputStyle}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Video ID"
                      value={editingLesson ? editingLesson.videoId : newLesson.videoId}
                      onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, videoId: e.target.value }) : setNewLesson({ ...newLesson, videoId: e.target.value })}
                      style={inputStyle}
                      className="input-field"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Channel Name"
                    value={editingLesson ? editingLesson.channel : newLesson.channel}
                    onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, channel: e.target.value }) : setNewLesson({ ...newLesson, channel: e.target.value })}
                    style={inputStyle}
                    className="input-field"
                  />
                  <div style={{ marginBottom: '1rem' }} className="content-section">
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Content Sentences</h4>
                    {(editingLesson ? editingLesson.content : newLesson.content).map((content, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder={`Sentence ${index + 1}`}
                          value={content}
                          onChange={(e) => {
                            const updatedContent = [...(editingLesson ? editingLesson.content : newLesson.content)];
                            updatedContent[index] = e.target.value;
                            if (editingLesson) {
                              setEditingLesson({ ...editingLesson, content: updatedContent });
                            } else {
                              setNewLesson({ ...newLesson, content: updatedContent });
                            }
                          }}
                          style={{ ...inputStyle, flex: 1 }}
                          className="input-field"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedContent = (editingLesson ? editingLesson.content : newLesson.content).filter((_, i) => i !== index);
                            if (editingLesson) {
                              setEditingLesson({ ...editingLesson, content: updatedContent });
                            } else {
                              setNewLesson({ ...newLesson, content: updatedContent });
                            }
                          }}
                          style={{ ...buttonStyle, backgroundColor: '#ef4444', width: '48px', height: '48px' }}
                          className="button delete-button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedContent = [...(editingLesson ? editingLesson.content : newLesson.content), ''];
                        if (editingLesson) {
                          setEditingLesson({ ...editingLesson, content: updatedContent });
                        } else {
                          setNewLesson({ ...newLesson, content: updatedContent });
                        }
                      }}
                      style={buttonStyle}
                      className="button"
                    >
                      <Plus size={16} /> Add Sentence
                    </button>
                  </div>
                  <div className="quiz-section">
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Quiz Questions</h4>
                    {(editingLesson ? editingLesson.quiz : newLesson.quiz).map((quizItem, index) => (
                      <div key={index} style={{ marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '1rem' }}>
                        <input
                          type="text"
                          placeholder={`Question ${index + 1}`}
                          value={quizItem.question}
                          onChange={(e) => {
                            const updatedQuiz = [...(editingLesson ? editingLesson.quiz : newLesson.quiz)];
                            updatedQuiz[index].question = e.target.value;
                            if (editingLesson) {
                              setEditingLesson({ ...editingLesson, quiz: updatedQuiz });
                            } else {
                              setNewLesson({ ...newLesson, quiz: updatedQuiz });
                            }
                          }}
                          style={inputStyle}
                          className="input-field"
                        />
                        {quizItem.options.map((option, optIndex) => (
                          <input
                            key={optIndex}
                            type="text"
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            value={option}
                            onChange={(e) => {
                              const updatedQuiz = [...(editingLesson ? editingLesson.quiz : newLesson.quiz)];
                              updatedQuiz[index].options[optIndex] = e.target.value;
                              if (editingLesson) {
                                setEditingLesson({ ...editingLesson, quiz: updatedQuiz });
                              } else {
                                setNewLesson({ ...newLesson, quiz: updatedQuiz });
                              }
                            }}
                            style={inputStyle}
                            className="input-field"
                          />
                        ))}
                        <select
                          value={quizItem.correct}
                          onChange={(e) => {
                            const updatedQuiz = [...(editingLesson ? editingLesson.quiz : newLesson.quiz)];
                            updatedQuiz[index].correct = parseInt(e.target.value);
                            if (editingLesson) {
                              setEditingLesson({ ...editingLesson, quiz: updatedQuiz });
                            } else {
                              setNewLesson({ ...newLesson, quiz: updatedQuiz });
                            }
                          }}
                          style={inputStyle}
                          className="input-field"
                        >
                          <option value={0}>Option A</option>
                          <option value={1}>Option B</option>
                          <option value={2}>Option C</option>
                          <option value={3}>Option D</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedQuiz = (editingLesson ? editingLesson.quiz : newLesson.quiz).filter((_, i) => i !== index);
                            if (editingLesson) {
                              setEditingLesson({ ...editingLesson, quiz: updatedQuiz });
                            } else {
                              setNewLesson({ ...newLesson, quiz: updatedQuiz });
                            }
                          }}
                          style={{ ...buttonStyle, backgroundColor: '#ef4444', width: '48px', height: '48px', marginTop: '0.75rem' }}
                          className="button delete-button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedQuiz = [...(editingLesson ? editingLesson.quiz : newLesson.quiz), { question: '', options: ['', '', '', ''], correct: 0 }];
                        if (editingLesson) {
                          setEditingLesson({ ...editingLesson, quiz: updatedQuiz });
                        } else {
                          setNewLesson({ ...newLesson, quiz: updatedQuiz });
                        }
                      }}
                      style={buttonStyle}
                      className="button"
                    >
                      <Plus size={16} /> Add Question
                    </button>
                  </div>
                  <button type="submit" style={buttonStyle} disabled={isLoading} className="button">
                    {isLoading ? 'Saving...' : (editingLesson ? 'Update Lesson' : 'Add Lesson')}
                  </button>
                </form>
                {editingLesson && (
                  <button
                    style={{ ...buttonStyle, backgroundColor: '#ef4444', marginTop: '1rem' }}
                    onClick={() => setEditingLesson(null)}
                    className="button"
                  >
                    Cancel Edit
                  </button>
                )}
                <div style={gridStyle} className="grid-container">
                  {filteredLessons.map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      style={lessonCardStyle}
                      className="lesson-card"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 style={lessonTitleStyle}>{lesson.title}</h3>
                      <p style={lessonInfoStyle}>Category: {lesson.category}</p>
                      <p style={lessonInfoStyle}>Difficulty: {lesson.difficulty}</p>
                      <p style={lessonInfoStyle}>Duration: {lesson.duration}</p>
                      <div style={actionButtonsStyle} className="action-buttons">
                        <button style={actionButtonStyle('edit')} onClick={() => handleEditLesson(lesson)} className="action-button">
                          <Edit size={16} /> Edit
                        </button>
                        <button style={actionButtonStyle('delete')} onClick={() => handleDeleteLesson(lesson.id)} className="action-button delete">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem' }}>User Management</h2>
                <div style={searchStyle} className="search-container">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchInputStyle}
                    className="input-field"
                  />
                  <Search size={20} style={searchIconStyle} />
                </div>
                <div style={gridStyle} className="grid-container">
                  {users.filter((user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((user) => (
                    <motion.div
                      key={user.id}
                      style={lessonCardStyle}
                      className="lesson-card"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 style={lessonTitleStyle}>{user.name}</h3>
                      <p style={lessonInfoStyle}>Email: {user.email}</p>
                      <p style={lessonInfoStyle}>Role: {user.isAdmin ? 'Admin' : 'User'}</p>
                      <p style={lessonInfoStyle}>Joined: {new Date(user.id).toLocaleDateString()}</p>
                      <div style={actionButtonsStyle} className="action-buttons">
                        <button style={actionButtonStyle('edit')} onClick={() => console.log('Edit user', user.id)} className="action-button">
                          <Edit size={16} /> Edit
                        </button>
                        <button style={actionButtonStyle('delete')} onClick={() => console.log('Delete user', user.id)} className="action-button delete">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem' }}>Statistics</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }} className="grid-container">
                  <div style={statCardStyle}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Lesson Completion Rate</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(#06b6d4 70%, #ef4444 0%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>70%</span>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: '0.5rem 0' }}>Total Lessons: {lessons.length}</p>
                        <p style={{ margin: '0.5rem 0' }}>Completed: 70%</p>
                      </div>
                    </div>
                  </div>
                  <div style={statCardStyle}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>User Activity</h3>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: '0.5rem 0' }}>Active Users: {users.length}</p>
                      <p style={{ margin: '0.5rem 0' }}>New Users This Week: 15</p>
                      <p style={{ margin: '0.5rem 0' }}>Average Session Time: 25 min</p>
                    </div>
                  </div>
                  <div style={statCardStyle}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Quiz Performance</h3>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: '0.5rem 0' }}>Total Quizzes: {stats.totalQuizzes}</p>
                      <p style={{ margin: '0.5rem 0' }}>Average Score: {stats.avgScore}%</p>
                      <p style={{ margin: '0.5rem 0' }}>Highest Score: 100%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem' }}>Settings</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }} className="grid-container">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Site Settings</h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Site Title</label>
                      <input type="text" placeholder="LearnFlow" style={inputStyle} className="input-field" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Maintenance Mode</label>
                      <select style={inputStyle} className="input-field">
                        <option value="off">Off</option>
                        <option value="on">On</option>
                      </select>
                    </div>
                    <button style={buttonStyle} className="button">Save Settings</button>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Backup & Export</h3>
                    <button style={exportButtonStyle} onClick={handleExportData} disabled={exporting} className="button">
                      <Download size={20} /> Export All Data
                    </button>
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                      <p>Export includes lessons, users, and progress data in JSON format.</p>
                      <p>Last backup: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
