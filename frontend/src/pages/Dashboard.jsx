import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService';
import { BookOpen, Trophy, Users, Star, TrendingUp, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, hasRole, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalStudents: 0,
    recentQuizzes: [],
    leaderboard: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      if (hasRole('STUDENT')) {
        const [quizzesRes, leaderboardRes] = await Promise.all([
          quizService.getQuizzes(0, 5).catch(() => ({ content: [] })),
          quizService.getLeaderboard().catch(() => ({ content: [] })),
        ]);
        setStats({
          recentQuizzes: quizzesRes.content || [],
          leaderboard: (leaderboardRes.content || []).slice(0, 5),
        });
      } else if (hasRole('FACULTY')) {
        const [quizzesRes, studentsRes] = await Promise.all([
          quizService.getFacultyQuizzes(0, 5).catch(() => ({ content: [], totalElements: 0 })),
          quizService.getStudents(0, 5).catch(() => ({ content: [], totalElements: 0 })),
        ]);
        setStats({
          totalQuizzes: quizzesRes.totalElements || 0,
          totalStudents: studentsRes.totalElements || 0,
          recentQuizzes: quizzesRes.content || [],
        });
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      setStats({
        totalQuizzes: 0,
        totalStudents: 0,
        recentQuizzes: [],
        leaderboard: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-primary-100 mt-1">
              {hasRole('STUDENT') 
                ? "Ready to learn something new today?" 
               : "Let's help students achieve their goals!"
              }
            </p>
          </div>
          {hasRole('STUDENT') && (
            <div className="text-right">
            4  <div className="text-3xl font-bold">{user?.xp || 0}</div>
              <div className="text-primary-100 text-sm">Total XP</div>
            </div>
          )}
        </div>
      </div>

      {hasRole('FACULTY') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentQuizzes.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasRole('STUDENT') && (
        <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
             onClick={() => navigate('/custom-quiz')}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="h-8 w-8" />
                <h3 className="text-2xl font-bold">AI Custom Quiz</h3>
              </div>
              <p className="text-purple-100 mb-4">
                Generate personalized quizzes on any topic with AI! Choose your difficulty and let our intelligent system create the perfect challenge.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">100 XP Reward</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">10 Questions</span>
                </div>
              </div>
            </div>
            <div className="text-6xl opacity-20">
              🤖
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {hasRole('STUDENT') ? 'Available Quizzes' : 'Recent Quizzes'}
            </h2>
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
          
          {stats.recentQuizzes.length > 0 ? (
            <div className="space-y-3">
              {stats.recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-primary-600">
                      <Star className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{quiz.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No quizzes available</p>
            </div>
          )}
        </div>

        {hasRole('STUDENT') && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
              <Trophy className="h-5 w-5 text-gray-400" />
            </div>
            
            {stats.leaderboard.length > 0 ? (
              <div className="space-y-3">
                {stats.leaderboard.map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{student.username}</p>
                        <p className="text-sm text-gray-600">{student.firstName} {student.lastName}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-primary-600">
                      <Award className="h-4 w-4 mr-1" />
                      <span className="font-medium">{student.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No leaderboard data available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;