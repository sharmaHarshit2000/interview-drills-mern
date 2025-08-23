import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth
export const getCurrentUser = () => api.get("/api/me");
export const googleLogin = () =>
  (window.location.href = `${API_URL}/auth/google`);

// Drills
export const getDrills = () => api.get("/api/drills");
export const getDrillById = (id: string) => api.get(`/api/drills/${id}`);

// Attempts
export const submitAttempt = (data: {
  drillId: string;
  answers: Array<{ qid: string; text: string }>;
}) => api.post("/api/attempts", data);

export const getAttempts = (limit: number = 5) =>
  api.get(`/api/attempts?limit=${limit}`);

// Logout
export const logoutUser = () => api.post("/auth/logout");
