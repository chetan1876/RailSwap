import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('railswap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear session and redirect to login.
// IMPORTANT: Skip redirect if the failing request is itself an auth endpoint
// (login / register), otherwise wrong credentials cause a page reload loop
// instead of showing an error message.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/api/auth/login') ||
                           requestUrl.includes('/api/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Expired / invalid token on a protected route → force re-login
      localStorage.removeItem('railswap_token');
      localStorage.removeItem('railswap_user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ── Auth APIs ──────────────────────────────────────────────────────────────────

export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  getMe: () => api.get('/api/auth/me'),
};

// ── Chatbot APIs ───────────────────────────────────────────────────────────────

export const chatbotAPI = {
  /**
   * Send a message and get AI reply.
   * @param {{ message: string, sessionId?: string, sessionName?: string }} data
   */
  sendMessage: (data) => api.post('/api/chat/message', data),

  /**
   * Get paginated chat history.
   * @param {string} sessionId
   * @param {number} page
   * @param {number} limit
   */
  getHistory: (sessionId = 'default', page = 1, limit = 50) =>
    api.get('/api/chat/history', { params: { sessionId, page, limit } }),

  /**
   * Clear all messages in a session.
   * @param {string} sessionId
   */
  clearHistory: (sessionId = 'default') =>
    api.delete('/api/chat/history', { params: { sessionId } }),

  /**
   * Soft-delete a single message.
   * @param {string} id
   */
  deleteMessage: (id) => api.delete(`/api/chat/${id}`),

  /**
   * Get all chat sessions for the user.
   */
  getSessions: () => api.get('/api/chat/sessions'),

  /**
   * Rename a chat session.
   * @param {string} sessionId
   * @param {string} sessionName
   */
  renameSession: (sessionId, sessionName) =>
    api.put(`/api/chat/session/${sessionId}`, { sessionName }),
};

export default api;
