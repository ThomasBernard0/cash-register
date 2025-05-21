import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:3000/api" : "/api",
});

const SKIP_AUTH_HEADER = "x-skip-auth";

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (config.headers && (config.headers as any)[SKIP_AUTH_HEADER]) {
      delete (config.headers as any)[SKIP_AUTH_HEADER];
      return config;
    }

    const token = localStorage.getItem("token");
    if (token && token.trim() !== "") {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
