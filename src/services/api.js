import axios from 'axios';

// API Base Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Service Functions

// Authentication Services
export const authService = {
  // User registration
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // User logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Token verification failed' };
    }
  }
};

// AI Query Services
export const aiService = {
  // Send text query to AI
  sendTextQuery: async (query, context = {}) => {
    try {
      const response = await api.post('/ai/query', {
        message: query,
        type: 'text',
        language: context.language || 'en',
        userContext: context
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'AI query failed' 
      };
    }
  },

  // Upload and analyze image
  analyzeImage: async (imageFile, query = '') => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('query', query);
      
      const response = await api.post('/ai/image-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Image analysis failed' 
      };
    }
  },

  // Get query history
  getQueryHistory: async (userId) => {
    try {
      const response = await api.get(`/ai/history/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch query history' 
      };
    }
  },

  // Escalate to expert
  escalateToExpert: async (queryId, reason) => {
    try {
      const response = await api.post('/ai/escalate', {
        queryId,
        reason,
        escalatedAt: new Date().toISOString()
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Escalation failed' 
      };
    }
  }
};

// Marketplace Services
export const marketplaceService = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/marketplace/products?${queryParams}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch products' 
      };
    }
  },

  // Get single product details
  getProduct: async (productId) => {
    try {
      const response = await api.get(`/marketplace/products/${productId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch product details' 
      };
    }
  },

  // Create new product listing
  createProduct: async (productData) => {
    try {
      const response = await api.post('/marketplace/products', productData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create product listing' 
      };
    }
  },

  // Update existing product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/marketplace/products/${productId}`, productData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update product' 
      };
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/marketplace/products/${productId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete product' 
      };
    }
  },

  // Get seller's products
  getSellerProducts: async (sellerId) => {
    try {
      const response = await api.get(`/marketplace/seller/${sellerId}/products`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch seller products' 
      };
    }
  }
};

// Community Forum Services
export const forumService = {
  // Get all forum posts
  getPosts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/forum/posts?${queryParams}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch forum posts' 
      };
    }
  },

  // Create new forum post
  createPost: async (postData) => {
    try {
      const response = await api.post('/forum/posts', postData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create forum post' 
      };
    }
  },

  // Get single post with comments
  getPost: async (postId) => {
    try {
      const response = await api.get(`/forum/posts/${postId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch post details' 
      };
    }
  },

  // Add comment to post
  addComment: async (postId, commentData) => {
    try {
      const response = await api.post(`/forum/posts/${postId}/comments`, commentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add comment' 
      };
    }
  },

  // Like/unlike post
  toggleLike: async (postId) => {
    try {
      const response = await api.post(`/forum/posts/${postId}/like`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to toggle like' 
      };
    }
  }
};

// Resource Library Services
export const resourceService = {
  // Get all resources
  getResources: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/resources?${queryParams}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch resources' 
      };
    }
  },

  // Get single resource
  getResource: async (resourceId) => {
    try {
      const response = await api.get(`/resources/${resourceId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch resource details' 
      };
    }
  },

  // Download resource
  downloadResource: async (resourceId) => {
    try {
      const response = await api.get(`/resources/${resourceId}/download`, {
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to download resource' 
      };
    }
  },

  // Track resource view
  trackView: async (resourceId) => {
    try {
      const response = await api.post(`/resources/${resourceId}/view`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to track view' 
      };
    }
  }
};

// User Profile Services
export const userService = {
  // Get user profile
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch user profile' 
      };
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}`, profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (userId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', imageFile);
      
      const response = await api.post(`/users/${userId}/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to upload profile picture' 
      };
    }
  }
};

// Analytics Services
export const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: async (userRole, timeRange = '30d') => {
    try {
      const response = await api.get(`/analytics/dashboard?role=${userRole}&range=${timeRange}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch analytics' 
      };
    }
  },

  // Get sales analytics for sellers
  getSalesAnalytics: async (sellerId, timeRange = '30d') => {
    try {
      const response = await api.get(`/analytics/sales/${sellerId}?range=${timeRange}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch sales analytics' 
      };
    }
  },

  // Get system analytics for agri officers
  getSystemAnalytics: async (timeRange = '30d') => {
    try {
      const response = await api.get(`/analytics/system?range=${timeRange}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch system analytics' 
      };
    }
  }
};

// Notification Services
export const notificationService = {
  // Get user notifications
  getNotifications: async (userId) => {
    try {
      const response = await api.get(`/notifications/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch notifications' 
      };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to mark notification as read' 
      };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const response = await api.put(`/notifications/${userId}/read-all`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to mark all notifications as read' 
      };
    }
  }
};

// Weather Services
export const weatherService = {
  // Get current weather for location
  getCurrentWeather: async (latitude, longitude) => {
    try {
      const response = await api.get(`/weather/current?lat=${latitude}&lon=${longitude}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch weather data' 
      };
    }
  },

  // Get weather forecast
  getWeatherForecast: async (latitude, longitude, days = 7) => {
    try {
      const response = await api.get(`/weather/forecast?lat=${latitude}&lon=${longitude}&days=${days}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch weather forecast' 
      };
    }
  }
};

// Market Price Services
export const marketPriceService = {
  // Get current market prices
  getMarketPrices: async (commodity, state = 'Kerala') => {
    try {
      const response = await api.get(`/market-prices?commodity=${commodity}&state=${state}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch market prices' 
      };
    }
  },

  // Get price trends
  getPriceTrends: async (commodity, timeRange = '30d') => {
    try {
      const response = await api.get(`/market-prices/trends?commodity=${commodity}&range=${timeRange}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch price trends' 
      };
    }
  }
};

// Government Schemes Services
export const schemesService = {
  // Get available government schemes
  getSchemes: async (category = 'all', state = 'Kerala') => {
    try {
      const response = await api.get(`/schemes?category=${category}&state=${state}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch government schemes' 
      };
    }
  },

  // Get scheme details
  getSchemeDetails: async (schemeId) => {
    try {
      const response = await api.get(`/schemes/${schemeId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch scheme details' 
      };
    }
  }
};

// Utility Functions
export const apiUtils = {
  // Handle file upload
  uploadFile: async (file, endpoint) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'File upload failed' 
      };
    }
  },

  // Download file
  downloadFile: async (url, filename) => {
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'File download failed' 
      };
    }
  },

  // Format error message
  formatErrorMessage: (error) => {
    if (error.response) {
      return error.response.data?.message || 'An error occurred';
    } else if (error.request) {
      return 'Network error - please check your connection';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Export all services
export default {
  auth: authService,
  ai: aiService,
  marketplace: marketplaceService,
  forum: forumService,
  resources: resourceService,
  user: userService,
  analytics: analyticsService,
  notifications: notificationService,
  weather: weatherService,
  marketPrice: marketPriceService,
  schemes: schemesService,
  utils: apiUtils
};
