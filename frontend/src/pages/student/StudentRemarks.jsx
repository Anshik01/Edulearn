import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quizService';
import { MessageSquare, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentRemarks = () => {
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchRemarks();
  }, [currentPage]);

  const fetchRemarks = async () => {
    try {
      const response = await quizService.getStudentRemarks(currentPage, 10);
      setRemarks(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      toast.error('Failed to load remarks');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <h1 className="text-2xl font-bold text-gray-900">My Remarks</h1>
          <p className="text-gray-600 mt-1">Feedback from your instructors</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MessageSquare className="h-4 w-4" />
          <span>{remarks.length} remarks</span>
        </div>
      </div>

      {remarks.length > 0 ? (
        <>
          <div className="space-y-4">
            {remarks.map((remark) => (
              <div key={remark.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {remark.faculty?.firstName} {remark.faculty?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">@{remark.faculty?.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(remark.createdAt)}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">{remark.remarkText}</p>
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
          <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No remarks yet</h3>
          <p className="text-gray-600">Your instructors haven't left any remarks yet.</p>
        </div>
      )}
    </div>
  );
};

export default StudentRemarks;