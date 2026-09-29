import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('resumeai_token', response.data.token);
      localStorage.setItem('resumeai_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('resumeai_token', response.data.token);
      localStorage.setItem('resumeai_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('resumeai_token');
      localStorage.removeItem('resumeai_user');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, passwordData) {
    const response = await api.put(`/auth/reset-password/${token}`, passwordData);
    if (response.data.token) {
      localStorage.setItem('resumeai_token', response.data.token);
      localStorage.setItem('resumeai_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};
