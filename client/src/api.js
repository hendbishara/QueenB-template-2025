import axios from 'axios';

// 1) create a pre-configured axios instance
const api = axios.create({ baseURL: '/api' });

// 2) request interceptor: runs before every request leaves your app
api.interceptors.request.use((config) => {
  // 2a) read a token (if any) from localStorage
  const token = localStorage.getItem('token');

  // 2b) attach Authorization header so protected endpoints work
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // 2c) always return the config (or a Promise.reject(error) if you threw)
  return config;
});

// 3) export the instance so the whole app uses the same rules
export default api;
