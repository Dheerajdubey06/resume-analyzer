import api from './api';

export const resumeService = {
  async uploadResume(file, onProgress) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  async getResumes() {
    const response = await api.get('/resumes');
    return response.data;
  },

  async getResumeById(id) {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  async deleteResume(id) {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },
};
