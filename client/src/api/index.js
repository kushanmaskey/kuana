import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kuana_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getEvents = () => api.get('/events');
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

export const getMedia = (params) => api.get('/media', { params });
export const createMedia = (data) => api.post('/media', data);
export const deleteMedia = (id) => api.delete(`/media/${id}`);

export const getAlumni = (params) => api.get('/alumni', { params });
export const registerAlumni = (data) => api.post('/alumni/register', data);
export const updateAlumni = (id, data) => api.put(`/alumni/${id}`, data);

export const submitContact = (data) => api.post('/contact', data);
export const getMessages = () => api.get('/contact');
export const markMessageRead = (id) => api.patch(`/contact/${id}/read`);

export const submitDonation = (data) => api.post('/donations', data);
export const getDonations = () => api.get('/donations');
export const getDonationStats = () => api.get('/donations/stats');

export const login = (data) => api.post('/auth/login', data);

export default api;
