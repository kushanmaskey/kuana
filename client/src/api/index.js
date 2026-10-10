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
export const toggleEventFeatured = (id, is_featured) => api.patch(`/events/${id}/featured`, { is_featured });
export const deleteEvent = (id) => api.delete(`/events/${id}`);

export const getMedia = (params) => api.get('/media', { params });
export const createMedia = (data) => api.post('/media', data);
export const updateMedia = (id, data) => api.put(`/media/${id}`, data);
export const toggleMediaFeatured = (id, is_featured) => api.patch(`/media/${id}/featured`, { is_featured });
export const deleteMedia = (id) => api.delete(`/media/${id}`);

export const getSpeakers = (params) => api.get('/speakers', { params });
export const createSpeaker = (data) => api.post('/speakers', data);
export const updateSpeaker = (id, data) => api.put(`/speakers/${id}`, data);
export const toggleSpeakerFeatured = (id, is_featured, year) => api.patch(`/speakers/${id}/featured`, { is_featured, year });
export const deleteSpeaker = (id) => api.delete(`/speakers/${id}`);

export const getAlumni = (params) => api.get('/alumni', { params });
export const registerAlumni = (data) => api.post('/alumni/register', data);
export const updateAlumni = (id, data) => api.put(`/alumni/${id}`, data);

export const submitContact = (data) => api.post('/contact', data);
export const getMessages = () => api.get('/contact');
export const markMessageRead = (id) => api.patch(`/contact/${id}/read`);
export const markMessageUnread = (id) => api.patch(`/contact/${id}/unread`);

export const submitDonation = (data) => api.post('/donations', data);
export const getDonations = () => api.get('/donations');
export const getDonationStats = () => api.get('/donations/stats');

export const getSetting = (key) => api.get(`/settings/${key}`);
export const updateSetting = (key, value) => api.put(`/settings/${key}`, { value });

export const login = (data) => api.post('/auth/login', data);
export const changePassword = (data) => api.patch('/auth/password', data);

export default api;
