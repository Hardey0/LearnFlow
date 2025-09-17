import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2 } from 'lucide-react';

const LessonUploader = () => {
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

  const handleAddContent = () => {
    setNewLesson({
      ...newLesson,
      content: [...newLesson.content, ''],
    });
  };

  const handleUpdateContent = (index, value) => {
    const updatedContent = [...newLesson.content];
    updatedContent[index] = value;
    setNewLesson({ ...newLesson, content: updatedContent });
  };

  const handleDeleteContent = (index) => {
    const updatedContent = newLesson.content.filter((_, i) => i !== index);
    setNewLesson({ ...newLesson, content: updatedContent });
  };

  const handleAddQuiz = () => {
    setNewLesson({
      ...newLesson,
      quiz: [...newLesson.quiz, { question: '', options: ['', '', '', ''], correct: 0 }],
    });
  };

  const handleUpdateQuiz = (index, field, value) => {
    const updatedQuiz = [...newLesson.quiz];
    if (field === 'correct') {
      updatedQuiz[index][field] = parseInt(value);
    } else if (field === 'options') {
      updatedQuiz[index][field] = value;
    } else {
      updatedQuiz[index][field] = value;
    }
    setNewLesson({ ...newLesson, quiz: updatedQuiz });
  };

  const handleDeleteQuiz = (index) => {
    const updatedQuiz = newLesson.quiz.filter((_, i) => i !== index);
    setNewLesson({ ...newLesson, quiz: updatedQuiz });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    // Upload logic here - save to localStorage or API
    console.log('Uploading lesson:', newLesson);
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

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  return (
    <div style={formStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Upload New Lesson</h2>
      <form style={{ display: 'grid', gap: '1rem' }} onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Title"
          value={newLesson.title}
          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={newLesson.description}
          onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
          required
          style={{ ...inputStyle, height: '80px' }}
        />
        <input
          type="text"
          placeholder="Category"
          value={newLesson.category}
          onChange={(e) => setNewLesson({ ...newLesson, category: e.target.value })}
          required
          style={inputStyle}
        />
        <select
          value={newLesson.difficulty}
          onChange={(e) => setNewLesson({ ...newLesson, difficulty: e.target.value })}
          style={inputStyle}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <input
          type="text"
          placeholder="Duration (e.g., 15 min)"
          value={newLesson.duration}
          onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Video URL"
          value={newLesson.videoUrl}
          onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Video ID (extract from URL)"
          value={newLesson.videoId}
          onChange={(e) => setNewLesson({ ...newLesson, videoId: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Channel Name"
          value={newLesson.channel}
          onChange={(e) => setNewLesson({ ...newLesson, channel: e.target.value })}
          style={inputStyle}
        />
        {/* Content Section */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Content Sentences</h3>
          {newLesson.content.map((content, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder={`Sentence ${index + 1}`}
                value={content}
                onChange={(e) => handleUpdateContent(index, e.target.value)}
                style={inputStyle}
              />
              <button type="button" onClick={() => handleDeleteContent(index)} style={{ ...buttonStyle, backgroundColor: '#ef4444' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddContent} style={buttonStyle}>
            <Plus size={16} /> Add Content
          </button>
        </div>
        {/* Quiz Section */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Quiz Questions</h3>
          {newLesson.quiz.map((quizItem, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                value={quizItem.question}
                onChange={(e) => handleUpdateQuiz(index, 'question', e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder={`Option A`}
                value={quizItem.options[0] || ''}
                onChange={(e) => {
                  const updatedOptions = [...quizItem.options];
                  updatedOptions[0] = e.target.value;
                  handleUpdateQuiz(index, 'options', updatedOptions);
                }}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder={`Option B`}
                value={quizItem.options[1] || ''}
                onChange={(e) => {
                  const updatedOptions = [...quizItem.options];
                  updatedOptions[1] = e.target.value;
                  handleUpdateQuiz(index, 'options', updatedOptions);
                }}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder={`Option C`}
                value={quizItem.options[2] || ''}
                onChange={(e) => {
                  const updatedOptions = [...quizItem.options];
                  updatedOptions[2] = e.target.value;
                  handleUpdateQuiz(index, 'options', updatedOptions);
                }}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder={`Option D`}
                value={quizItem.options[3] || ''}
                onChange={(e) => {
                  const updatedOptions = [...quizItem.options];
                  updatedOptions[3] = e.target.value;
                  handleUpdateQuiz(index, 'options', updatedOptions);
                }}
                style={inputStyle}
              />
              <select
                value={quizItem.correct}
                onChange={(e) => handleUpdateQuiz(index, 'correct', e.target.value)}
                style={inputStyle}
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
              <button type="button" onClick={() => handleDeleteQuiz(index)} style={{ ...buttonStyle, backgroundColor: '#ef4444' }}>
                <Trash2 size={16} /> Delete Question
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddQuiz} style={buttonStyle}>
            <Plus size={16} /> Add Question
          </button>
        </div>
        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Lesson'}
        </button>
      </form>
    </div>
  );
};

export default LessonUploader;