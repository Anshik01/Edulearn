import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },
  
  getCurrentUserProfile: async () => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No user logged in');
    
    const endpoint = user.role === 'STUDENT' ? '/student/profile' : '/faculty/profile';
    const response = await api.get(endpoint);
    return {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
      xp: response.data.xp || 0,
    };
  }
};