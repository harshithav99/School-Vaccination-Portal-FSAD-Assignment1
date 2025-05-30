import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5055/api', 
});

// Add token automatically to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;