import api from './api';

export const adminService = {
  async getAdminStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};
