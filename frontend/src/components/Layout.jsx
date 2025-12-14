import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Trophy, 
  User, 
  LogOut, 
  PlusCircle, 
  Users, 
  MessageSquare,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';

const Layout = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const studentNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/quizzes', icon: BookOpen, label: 'Quizzes' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/remarks', icon: MessageSquare, label: 'My Remarks' },
    { path: '/student-profile', icon: User, label: 'Profile' },
  ];

  const facultyNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/my-quizzes', icon: BookOpen, label: 'My Quizzes' },
    { path: '/create-quiz', icon: PlusCircle, label: 'Create Quiz' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/my-remarks', icon: MessageSquare, label: 'My Remarks' },
    { path: '/faculty-profile', icon: User, label: 'Profile' },
  ];

  const navItems = hasRole('STUDENT') ? studentNavItems : facultyNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduLearn</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{user?.username}</span>
                </div>
                {hasRole('STUDENT') && (
                  <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                    {user?.xp || 0} XP
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(path)
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;