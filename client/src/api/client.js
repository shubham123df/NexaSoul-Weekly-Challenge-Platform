import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAdminSecret = (secret) => {
  api.defaults.headers.common['x-admin-secret'] = secret;
};

export const quizApi = {
  getActive: () => api.get('/quiz/active'),
  getById: (id) => api.get(`/quiz/${id}`),
  checkEmail: (email) => api.get(`/quiz/active/check-email?email=${encodeURIComponent(email)}`),
  checkWeeklyUID: (uid) => api.get(`/quiz/check-weekly-uid?uid=${encodeURIComponent(uid)}`),
  submit: (id, data) => api.post(`/quiz/${id}/submit`, data),
  getReview: (quizId, submissionId) => api.get(`/quiz/${quizId}/review/${submissionId}`),
};

export const leaderboardApi = {
  getTop: (limit = 10) => api.get(`/leaderboard/active/top?limit=${limit}`),
  getByQuiz: (quizId, limit = 10) => api.get(`/leaderboard/${quizId}?limit=${limit}`),
};

export const adminApi = {
  getQuizzes: () => api.get('/admin/quizzes'),
  createQuiz: (data) => api.post('/admin/quizzes', data),
  updateQuiz: (id, data) => api.put(`/admin/quizzes/${id}`, data),
  toggleQuiz: (id) => api.patch(`/admin/quizzes/${id}/toggle`),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
  addQuestion: (id, data) => api.post(`/admin/quizzes/${id}/questions`, data),
  updateQuestion: (id, qIndex, data) => api.put(`/admin/quizzes/${id}/questions/${qIndex}`, data),
  deleteQuestion: (id, qIndex) => api.delete(`/admin/quizzes/${id}/questions/${qIndex}`),
  getAnalytics: (quizId) => api.get(`/analytics/${quizId}`),
  exportCsv: (quizId) => api.get(`/analytics/${quizId}/export/csv`, { responseType: 'blob' }),
  exportExcel: (quizId) => api.get(`/analytics/${quizId}/export/excel`, { responseType: 'blob' }),
  getSubmissions: (quizId) => api.get(`/admin/quizzes/${quizId}/submissions`),
  getSubmissionDetails: (id) => api.get(`/admin/submissions/${id}`),
  deleteSubmission: (id) => api.delete(`/admin/submissions/${id}`),
  deleteMultipleSubmissions: (submissionIds) => api.post('/admin/submissions/delete-multiple', { submissionIds }),
};

export default api;
