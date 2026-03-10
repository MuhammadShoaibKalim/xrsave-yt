import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.error === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh-token');
        const newToken = data.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── API Methods ────────────────────────────────────────────────────────────

export const metadataApi = {
  getInfo: (url) => api.post('/metadata/info', { url }),
  getThumbnails: (url) => api.post('/metadata/thumbnail', { url }),
};

export const videoApi = {
  getFormats: (url) => api.get('/video/formats', { params: { url } }),
  getDownloadUrl: (url, quality, itag) =>
    `${API_URL}/video/download`,
  download: (url, quality, itag) =>
    api.post('/video/download', { url, quality, itag }, { responseType: 'blob' }),
};

export const audioApi = {
  getFormats: () => api.get('/audio/formats'),
  download: (url, format, quality) =>
    api.post('/audio/download', { url, format, quality }, { responseType: 'blob' }),
};

export const thumbnailApi = {
  download: (url, quality) =>
    api.post('/thumbnail/download', { url, quality }, { responseType: 'blob' }),
};

export const subtitleApi = {
  getLanguages: (url) => api.get('/subtitle/languages', { params: { url } }),
  download: (url, languageCode, format) =>
    api.post('/subtitle/download', { url, languageCode, format }, { responseType: 'blob' }),
};

export const shortsApi = {
  download: (url, quality) =>
    api.post('/shorts/download', { url, quality }, { responseType: 'blob' }),
};

export const playlistApi = {
  getInfo: (url) => api.post('/playlist/info', { url }),
  download: (url, type, quality, format) =>
    api.post('/playlist/download', { url, type, quality, format }),
  getStatus: (jobId) => api.get(`/playlist/status/${jobId}`),
};

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

export const historyApi = {
  get: (page, limit) => api.get('/history', { params: { page, limit } }),
  delete: (id) => api.delete(`/history/${id}`),
  clear: () => api.delete('/history'),
};

export default api;
