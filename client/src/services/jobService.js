import api from './api';

export const jobService = {
  async createJob(jobData) {
    let payload;
    let headers = {};

    if (jobData instanceof FormData) {
      payload = jobData;
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = jobData;
    }

    const response = await api.post('/jobs', payload, { headers });
    return response.data;
  },

  async getJobs() {
    const response = await api.get('/jobs');
    return response.data;
  },

  async getJobById(id) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  async deleteJob(id) {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
};
