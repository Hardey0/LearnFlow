import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Upload, BookOpen, ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    id: '',
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
  const [editingLesson, setEditingLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load lessons from localStorage
  useEffect(() => {
    const storedLessons = JSON.parse(localStorage.getItem('adminLessons') || '[]');
    setLessons(storedLessons);
  }, []);

  // Save lessons to localStorage
  const saveLessons = (updatedLessons) => {
    localStorage.setItem('adminLessons', JSON.stringify(updatedLessons));
    setLessons(updatedLessons);
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const updatedLessons = [...lessons, { ...newLesson, id: Date.now() }];
      saveLessons(updatedLessons);
      setNewLesson({
        id: '',
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

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
  };

  const handleUpdateLesson = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const updatedLessons = lessons.map((l) => (l.id === editingLesson.id ? editingLesson : l));
      saveLessons(updatedLessons);
      setEditingLesson(null);
      setIsLoading(false);
    }, 500);
  };

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedLessons = lessons.filter((l) => l.id !== lessonId);
      saveLessons(updatedLessons);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentAdmin');
    navigate('/admin/login');
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
    padding: '2rem',
    color: '#fff',
    fontFamily: '"Inter", sans-serif',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const formStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    marginBottom: '1rem',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
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
  };

  const lessonTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  };

  const lessonInfoStyle = {
    fontSize: '0.9rem',
    opacity: '0.8',
    marginBottom: '0.5rem',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
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
  });

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Admin Dashboard</h1>
          <button style={buttonStyle} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Add New Lesson Form */}
        <motion.div
          style={formStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
          </h2>
          <form style={{ display: 'grid', gap: '1rem' }} onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson}>
            <input
              type="text"
              placeholder="Title"
              value={editingLesson ? editingLesson.title : newLesson.title}
              onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, title: e.target.value }) : setNewLesson({ ...newLesson, title: e.target.value })}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="Description"
              value={editingLesson ? editingLesson.description : newLesson.description}
              onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, description: e.target.value }) : setNewLesson({ ...newLesson, description: e.target.value })}
              required
              style={{ ...inputStyle, height: '80px' }}
            />
            <input
              type="text"
              placeholder="Category"
              value={editingLesson ? editingLesson.category : newLesson.category}
              onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, category: e.target.value }) : setNewLesson({ ...newLesson, category: e.target.value })}
              required
              style={inputStyle}
            />
            <select
              value={editingLesson ? editingLesson.difficulty : newLesson.difficulty}
              onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, difficulty: e.target.value }) : setNewLesson({ ...newLesson, difficulty: e.target.value })}
              style={inputStyle}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <input
              type="text"
              placeholder="Duration (e.g., 15 min)"
              value={editingLesson ? editingLesson.duration : newLesson.duration}
              onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, duration: e.target.value }) : setNewLesson({ ...newLesson, duration: e.target.value })}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Video URL"
              value={editingLesson ? editingLesson.videoUrl : newLesson.videoUrl}
              onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, videoUrl: e.target.value }) : setNewLesson({ ...newLesson, videoUrl: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Video ID (extract from URL)"
              value={editingLesson ? editingLesson.videoId : newLesson.videoId}
              onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, videoId: e.target.value }) : setNewLesson({ ...newLesson, videoId: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Channel Name"
              value={editingLesson ? editingLesson.channel : newLesson.channel}
              onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, channel: e.target.value }) : setNewLesson({ ...newLesson, channel: e.target.value })}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle} disabled={isLoading}>
              {isLoading ? 'Saving...' : (editingLesson ? 'Update Lesson' : 'Add Lesson')}
            </button>
          </form>
          {editingLesson && (
            <button
              style={{ ...buttonStyle, backgroundColor: '#ef4444', marginTop: '1rem' }}
              onClick={() => setEditingLesson(null)}
            >
              Cancel Edit
            </button>
          )}
        </motion.div>

        {/* Lessons Grid */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {lessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              style={lessonCardStyle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 style={lessonTitleStyle}>{lesson.title}</h3>
              <p style={lessonInfoStyle}>Category: {lesson.category}</p>
              <p style={lessonInfoStyle}>Difficulty: {lesson.difficulty}</p>
              <div style={actionButtonsStyle}>
                <button
                  style={actionButtonStyle('edit')}
                  onClick={() => handleEditLesson(lesson)}
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  style={actionButtonStyle('delete')}
                  onClick={() => handleDeleteLesson(lesson.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;