// axiosConfig.js
import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Set your base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
