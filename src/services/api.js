import axios from 'axios';

// Get base URL from environment variables or use default
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = 'https://bharat-mart.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (session expired)
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  // Optional: redirect to login
  // window.location.href = '/login';
};

export const login = async (credentials) => {
  const { data } = await api.post('/users/login', credentials);
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/users/register', userData);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const updateProfile = async (userData) => {
  const { data } = await api.put('/users/profile', userData);
  return data;
};

export const uploadLogo = async (formData) => {
  const { data } = await api.post('/users/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// Users Endpoints (Admin only)
export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
}

// Product Endpoints
export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  // Use FormData if productData contains files
  const { data } = await api.post('/products', productData, {
    headers: {
      'Content-Type': productData instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData, {
    headers: {
      'Content-Type': productData instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const approveProduct = async (id) => {
  const { data } = await api.put(`/products/${id}/approve`);
  return data;
};

// Order/Payment Endpoints
export const createOrder = async (orderData) => {
  const { data } = await api.post('/payment/create-order', orderData);
  return data;
};

export const verifyPayment = async (paymentDetails) => {
  const { data } = await api.post('/payment/verify-payment', paymentDetails);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get('/payment/my-orders');
  return data;
};

export const getSellerOrders = async () => {
  const { data } = await api.get('/payment/seller-orders');
  return data;
};

export const getAllOrders = async () => {
  const { data } = await api.get('/payment/all-orders');
  return data;
};

// Stats Endpoints
export const getAdminStats = async () => {
  const { data } = await api.get('/stats/admin');
  return data;
};

export const getSellerStats = async () => {
  const { data } = await api.get('/stats/seller');
  return data;
};

export default api;
