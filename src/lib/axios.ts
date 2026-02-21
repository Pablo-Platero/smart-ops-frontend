import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// (manejo de errores global)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Aquí podés manejar 401/403, logs, etc.
    return Promise.reject(error);
  }
);
