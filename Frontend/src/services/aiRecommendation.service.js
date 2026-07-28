import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/ai-recommendation";

/**
 * Gets authentication headers containing bearer token from local storage.
 * @returns {object} headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("railswap_token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const aiRecommendationAPI = {
  /**
   * Request a new AI travel recommendation.
   */
  generateRecommendation: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/`, data, getAuthHeaders());
    return response.data;
  },

  /**
   * Get recommendation history.
   */
  getHistory: async () => {
    const response = await axios.get(`${API_BASE_URL}/history`, getAuthHeaders());
    return response.data;
  },

  /**
   * Get recent recommendations.
   */
  getRecent: async (limit = 5) => {
    const response = await axios.get(`${API_BASE_URL}/recent?limit=${limit}`, getAuthHeaders());
    return response.data;
  },

  /**
   * Search history logs.
   */
  search: async (query) => {
    const response = await axios.get(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, getAuthHeaders());
    return response.data;
  },

  /**
   * Get recommendation details by ID.
   */
  getDetails: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  /**
   * Bookmark or unbookmark a recommendation log.
   */
  bookmark: async (id) => {
    const response = await axios.post(`${API_BASE_URL}/${id}/bookmark`, {}, getAuthHeaders());
    return response.data;
  },

  /**
   * Delete a single recommendation record.
   */
  deleteItem: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  /**
   * Clear all recommendation history.
   */
  clearHistory: async () => {
    const response = await axios.delete(`${API_BASE_URL}/history`, getAuthHeaders());
    return response.data;
  },

  /**
   * Fetch supported booking providers list.
   */
  getBookingProviders: async () => {
    const response = await axios.get(`${API_BASE_URL}/booking/providers`, getAuthHeaders());
    return response.data;
  },

  /**
   * Prepare booking payload and get redirect URL for provider.
   */
  prepareBooking: async (bookingData) => {
    const response = await axios.post(`${API_BASE_URL}/booking/prepare`, bookingData, getAuthHeaders());
    return response.data;
  },
};

