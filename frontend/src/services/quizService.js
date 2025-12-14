import api from './api';

export const quizService = {
  // Student endpoints
  getQuizzes: async (page = 0, size = 10) => {
    const response = await api.get(`/student/quizzes?page=${page}&size=${size}`);
    return response.data;
  },

  getQuizById: async (id) => {
    const response = await api.get(`/student/quizzes/${id}`);
    return response.data;
  },

  submitQuizAttempt: async (attemptData) => {
    const response = await api.post('/student/quiz-attempts', attemptData);
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get('/student/leaderboard');
    return response.data;
  },

  getStudentProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  getStudentRemarks: async (page = 0, size = 10) => {
    const response = await api.get(`/student/remarks?page=${page}&size=${size}`);
    return response.data;
  },

  getQuizResults: async (page = 0, size = 10) => {
    const response = await api.get(`/student/quiz-results?page=${page}&size=${size}`);
    return response.data;
  },

  // Faculty endpoints
  createQuiz: async (quizData) => {
    const response = await api.post('/faculty/quizzes', quizData);
    return response.data;
  },

  getFacultyQuizzes: async (page = 0, size = 10) => {
    const response = await api.get(`/faculty/quizzes?page=${page}&size=${size}`);
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await api.delete(`/faculty/quizzes/${id}`);
    return response.data;
  },

  addRemark: async (remarkData) => {
    const response = await api.post('/faculty/remarks', remarkData);
    return response.data;
  },

  getFacultyRemarks: async (page = 0, size = 10) => {
    const response = await api.get(`/faculty/remarks?page=${page}&size=${size}`);
    return response.data;
  },

  getStudents: async (page = 0, size = 10, search = '') => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/faculty/students?page=${page}&size=${size}${searchParam}`);
    return response.data;
  },

  // Profile endpoints
  updateProfile: async (profileData, role) => {
    const endpoint = role === 'STUDENT' ? '/student/profile' : '/faculty/profile';
    const response = await api.put(endpoint, profileData);
    return response.data;
  },

  getProfile: async (role) => {
    const endpoint = role === 'STUDENT' ? '/student/profile' : '/faculty/profile';
    const response = await api.get(endpoint);
    return response.data;
  },

  // Test endpoints
  testBackend: async () => {
    const response = await api.get('/test/health');
    return response.data;
  },

  testCreateQuiz: async (quizData) => {
    console.log('Sending quiz data:', JSON.stringify(quizData, null, 2));
    const response = await api.post('/test/echo', quizData);
    return response.data;
  },

  // Custom quiz generation
  generateCustomQuiz: async (topic, difficulty) => {
    const response = await api.post('/student/custom-quiz', { topic, difficulty });
    return response.data;
  },

  // Test custom quiz generation
  testGenerateCustomQuiz: async (topic, difficulty) => {
    const response = await api.post('/student/test-custom-quiz', { topic, difficulty });
    return response.data;
  },

  // Complete custom quiz and update XP
  completeCustomQuiz: async (score, xpEarned) => {
    const response = await api.post('/student/custom-quiz-complete', { score, xpEarned });
    return response.data;
  }
};