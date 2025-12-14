import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { BookOpen, Star, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage]);

  const fetchQuizzes = async () => {
    try {
      const response = await quizService.getQuizzes(currentPage, 6);
      setQuizzes(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
          <p className="text-gray-600 mt-1">Test your knowledge and earn XP!</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BookOpen className="h-4 w-4" />
          <span>{quizzes.length} quizzes available</span>
        </div>
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
                    <Clock className="h-4 w-4" />
                    <span>{quiz.questions?.length || 0} questions</span>
                  </div>
                  <span>By {quiz.faculty?.username}</span>
                </div>

                <Link
                  to={`/quiz/${quiz.id}`}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Start Quiz</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
          <p className="text-gray-600">Check back later for new quizzes!</p>
        </div>
      )}
    </div>
  );
};

export default Quizzes;