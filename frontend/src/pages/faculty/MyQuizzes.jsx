import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { BookOpen, Plus, Trash2, Eye, Calendar, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage]);

  const fetchQuizzes = async () => {
    try {
      const response = await quizService.getFacultyQuizzes(currentPage, 6);
      setQuizzes(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    setDeletingId(id);
    try {
      await quizService.deleteQuiz(id);
      toast.success('Quiz deleted successfully');
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to delete quiz');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
          <p className="text-gray-600 mt-1">Manage your created quizzes</p>
        </div>
        <Link
          to="/create-quiz"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Quiz</span>
        </Link>
      </div>

      {quizzes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-primary-600">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">{quiz.xpReward} XP</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(quiz.createdAt)}</span>
                  </div>
                  <span>{quiz.questions?.length || 0} questions</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    disabled={deletingId === quiz.id}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === quiz.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quiz Stats */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attempts:</span>
                    <span className="font-medium">{quiz.attempts?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-2 text-sm border rounded-lg ${
                    currentPage === i
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes created yet</h3>
          <p className="text-gray-600 mb-6">Create your first quiz to get started!</p>
          <Link
            to="/create-quiz"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Your First Quiz</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;