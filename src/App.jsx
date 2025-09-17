import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Lessons from './components/Lessons';
import LessonDetail from './components/LessonDetail';
import Quiz from './components/Quiz';
import Progress from './components/Progress';
import Practice from './components/Practice';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminLogin from './components/Auth/AdminLogin';
import AdminSignup from './components/Auth/AdminSignup';
import AdminDashboard from './components/Admin/AdminDashboard';

const ProtectedRoute = ({ children, isAdminRoute = false }) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const admin = JSON.parse(localStorage.getItem('currentAdmin') || 'null');
  const isAuthenticated = isAdminRoute ? !!admin : !!user;

  if (!isAuthenticated) {
    return <Navigate to={isAdminRoute ? '/admin/login' : '/login'} replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:id"
          element={
            <ProtectedRoute>
              <LessonDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdminRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
