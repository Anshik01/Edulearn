import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { quizService } from '../../services/quizService';
import EditProfile from '../../components/EditProfile';
import { User, Mail, Phone, BookOpen, Users, MessageSquare, Calendar, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await quizService.getProfile('FACULTY');
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
          <p className="text-gray-600 mt-1">Manage your account information and teaching activities</p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Quizzes</h2>
            
            {profile?.createdQuizzes && profile.createdQuizzes.length > 0 ? (
              <div className="space-y-3">
                {profile.createdQuizzes.slice(0, 5).map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(quiz.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">{quiz.xpReward} XP</div>
                      <div className="text-sm text-gray-500">{quiz.questions?.length || 0} questions</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No quizzes created yet</p>
                <p className="text-sm">Start creating quizzes to see them here!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Teaching Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Quizzes Created</span>
                </div>
                <span className="font-medium">{profile?.createdQuizzes?.length || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Remarks Given</span>
                </div>
                <span className="font-medium">{profile?.remarks?.length || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Role</span>
                </div>
                <span className="font-medium">Faculty</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <button className="w-full text-left p-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-gray-900">Create New Quiz</span>
                </div>
              </button>
              
              <button className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">View Students</span>
                </div>
              </button>
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