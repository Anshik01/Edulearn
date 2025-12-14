import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import DebugPanel from './components/DebugPanel';
import ProfileRedirect from './components/ProfileRedirect';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/student/Quizzes';
import QuizTake from './pages/student/QuizTake';
import CustomQuizGenerator from './pages/student/CustomQuizGenerator';
import Leaderboard from './pages/student/Leaderboard';
import StudentRemarks from './pages/student/StudentRemarks';
import Profile from './pages/student/Profile';
import MyQuizzes from './pages/faculty/MyQuizzes';
import CreateQuiz from './pages/faculty/CreateQuiz';
import Students from './pages/faculty/Students';
import FacultyRemarks from './pages/faculty/FacultyRemarks';
import FacultyProfile from './pages/faculty/Profile';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Student Routes */}
              <Route
                path="quizzes"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <Quizzes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="quiz/:id"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <QuizTake />
                  </ProtectedRoute>
                }
              />
              <Route
                path="quiz-take"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <QuizTake />
                  </ProtectedRoute>
                }
              />
              <Route
                path="custom-quiz"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <CustomQuizGenerator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="leaderboard"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="remarks"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <StudentRemarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="student-profile"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              {/* Faculty Routes */}
              <Route
                path="my-quizzes"
                element={
                  <ProtectedRoute requiredRole="FACULTY">
                    <MyQuizzes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="create-quiz"
                element={
                  <ProtectedRoute requiredRole="FACULTY">
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="students"
                element={
                  <ProtectedRoute requiredRole="FACULTY">
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-remarks"
                element={
                  <ProtectedRoute requiredRole="FACULTY">
                    <FacultyRemarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="faculty-profile"
                element={
                  <ProtectedRoute requiredRole="FACULTY">
                    <FacultyProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* Generic profile route that redirects based on role */}
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfileRedirect />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          
          <DebugPanel />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;