import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getProducts() {
    return apiClient.get('/products');
  },
  getProduct(id) {
    return apiClient.get(`/products/${id}`);
  },
  loginUser(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  registerUser(userData) {
    return apiClient.post('/auth/register', userData);
  },
  createOrder(orderData) {
    return apiClient.post('/orders', orderData);
  },
  getOrder(orderId) {
    return apiClient.get(`/orders/${orderId}`);
  },
};