import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkMisinformation = (content) => api.post('/check', { content });
export const summarizeInformation = (content) => api.post('/summarize', { content });
export const autocorrectText = (content) => api.post('/autocorrect', { content });
export const getTrends = () => api.get('/trends');
export const submitReport = (data) => api.post('/report', data);

export default api;
