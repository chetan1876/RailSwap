import axios from "axios";

const API_BASE_URL =
  "http://localhost:5000/api/auth";

export const authAPI = {
  login: async (data) => {
    return axios.post(
      `${API_BASE_URL}/login`,
      data
    );
  },

  register: async (data) => {
    return axios.post(
      `${API_BASE_URL}/register`,
      data
    );
  },

  verifyOtp: async (data) => {
    return axios.post(
      `${API_BASE_URL}/verify-otp`,
      data
    );
  },

  forgotPassword: async (data) => {
    return axios.post(
      `${API_BASE_URL}/forgot-password`,
      data
    );
  },

  resetPassword: async (data) => {
    return axios.post(
      `${API_BASE_URL}/reset-password`,
      data
    );
  },

  logout: async (token) => {
    return axios.post(
      `${API_BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};