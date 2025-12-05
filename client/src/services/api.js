import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeText = async (text) => {
  try {
    const response = await api.post('/analyze/text', { text });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to analyze text');
  }
};

export const analyzeImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/analyze/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to analyze image');
  }
};

export const analyzeUrl = async (url) => {
  try {
    const response = await api.post('/analyze/url', { url });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to analyze URL');
  }
};

export const getResources = async (category) => {
  try {
    const response = await api.get(`/resources/${category}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch resources');
  }
};

export const submitFeedback = async (analysisId, feedback, helpful) => {
  try {
    const response = await api.post('/resources/feedback', {
      analysisId,
      feedback,
      helpful,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to submit feedback');
  }
};

export default api;
