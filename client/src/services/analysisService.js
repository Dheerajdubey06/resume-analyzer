import api from './api';

export const analysisService = {
  async createAnalysis(analysisData) {
    const response = await api.post('/analysis', analysisData);
    return response.data;
  },

  async getAnalyses(params = {}) {
    const response = await api.get('/analysis', { params });
    return response.data;
  },

  async getAnalysisById(id) {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
  },

  async deleteAnalysis(id) {
    const response = await api.delete(`/analysis/${id}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async seedDemoData() {
    const response = await api.post('/demo/seed');
    return response.data;
  },
};
