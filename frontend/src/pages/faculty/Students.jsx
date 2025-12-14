import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quizService';
import { Users, Search, MessageSquare, Star, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [submittingRemark, setSubmittingRemark] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm]);

  const fetchStudents = async () => {
    try {
      const response = await quizService.getStudents(currentPage, 10, searchTerm);
      setStudents(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleAddRemark = async (studentId) => {
    if (!remarkText.trim()) {
      toast.error('Please enter a remark');
      return;
    }

    setSubmittingRemark(true);
    try {
      await quizService.addRemark({
        studentId,
        remarkText: remarkText
      });
      toast.success('Remark added successfully');
      setSelectedStudent(null);
      setRemarkText('');
    } catch (error) {
      toast.error('Failed to add remark');
    } finally {
      setSubmittingRemark(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage and monitor student progress</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{students.length} students</span>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search students by name, username, or email..."
          />
        </div>
      </div>

      {students.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">@{student.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-primary-600">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">{student.xp || 0} XP</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Quiz Attempts: {student.quizAttempts?.length || 0}</span>
                  <span>Remarks: {student.remarks?.length || 0}</span>
                </div>

                <button
                  onClick={() => setSelectedStudent(student)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Add Remark</span>
                </button>
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
          <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No students found' : 'No students yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Students will appear here once they register'}
          </p>
        </div>
      )}

      {/* Add Remark Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Remark for {selectedStudent.firstName} {selectedStudent.lastName}
            </h3>
            
            <textarea
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="4"
              placeholder="Enter your remark about the student's performance..."
            />

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setRemarkText('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddRemark(selectedStudent.id)}
                disabled={submittingRemark}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submittingRemark ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Add Remark</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;