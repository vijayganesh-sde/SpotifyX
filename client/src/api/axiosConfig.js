import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const API = axios.create({
  baseURL: API_URL,
});

// Request Handler
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},(error) => {
  return Promise.reject(error);
});

// Response Handler
API.interceptors.response.use((response) => {
  return response;
},(error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized access (e.g., token expired)
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  }
  return Promise.reject(error);
});

export default API;