import api from './api';

export const userService = {
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    let payload;
    let headers = {};

    if (profileData instanceof FormData) {
      payload = profileData;
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = profileData;
    }

    const response = await api.put('/profile', payload, { headers });
    if (response.data.user) {
      localStorage.setItem('resumeai_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async updatePassword(passwordData) {
    const response = await api.put('/settings/password', passwordData);
    return response.data;
  },

  async deleteAccount() {
    const response = await api.delete('/account');
    localStorage.removeItem('resumeai_token');
    localStorage.removeItem('resumeai_user');
    return response.data;
  },
};
