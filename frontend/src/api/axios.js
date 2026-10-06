
import axios from "axios";
import { getToken } from "../utils/token";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080/api"
).trim().replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
