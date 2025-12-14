import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { quizService } from '../../services/quizService';
import EditProfile from '../../components/EditProfile';
import { User, Mail, Phone, Star, BookOpen, Trophy, Calendar, Edit, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await quizService.getStudentProfile();
      setProfile(response);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and view your progress</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/custom-quiz')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Custom Quiz</span>
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {profile?.firstName} {profile?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-medium text-gray-900">@{profile?.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{profile?.email}</p>
                </div>
              </div>

              {profile?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Attempts */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Quiz Attempts</h2>
            
            {profile?.quizAttempts && profile.quizAttempts.length > 0 ? (
              <div className="space-y-3">
                {profile.quizAttempts.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{attempt.quiz?.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(attempt.attemptedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">{attempt.score}%</div>
                      <div className="text-sm text-gray-500">+{attempt.xpEarned} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No quiz attempts yet</p>
                <p className="text-sm">Start taking quizzes to see your progress here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* XP Card */}
          <div className="card text-center">
            <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-white mb-4">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{profile?.xp || 0}</div>
              <div className="text-primary-100">Total XP</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next Level</span>
                <span className="font-medium">{Math.ceil((profile?.xp || 0) / 100) * 100}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ 
                    width: `${((profile?.xp || 0) % 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Quizzes Taken</span>
                </div>
                <span className="font-medium">{profile?.quizAttempts?.length || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Average Score</span>
                </div>
                <span className="font-medium">
                  {profile?.quizAttempts?.length > 0
                    ? Math.round(
                        profile.quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
                        profile.quizAttempts.length
                      )
                    : 0}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-primary-500" />
                  <span className="text-sm text-gray-600">Total XP Earned</span>
                </div>
                <span className="font-medium">{profile?.xp || 0}</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
            
            <div className="space-y-2">
              {(profile?.xp || 0) >= 100 && (
                <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-yellow-800">First 100 XP</span>
                </div>
              )}
              
              {(profile?.quizAttempts?.length || 0) >= 5 && (
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-800">Quiz Master</span>
                </div>
              )}
              
              {(profile?.xp || 0) >= 500 && (
                <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                  <Star className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-purple-800">Rising Star</span>
                </div>
              )}

              {((profile?.quizAttempts?.length || 0) === 0 && (profile?.xp || 0) < 100) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Complete quizzes to earn achievements!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProfile
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={(updatedUser) => {
          setProfile(updatedUser);
        }}
      />
    </div>
  );
};

export default Profile;