import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log("API URL:", API_URL); // Debug log

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is crucial for sending cookies
});

// Auth
export const getCurrentUser = () => api.get("/me"); // Remove /api prefix since baseURL already has it
export const googleLogin = () =>
  (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`);

// Drills
export const getDrills = () => api.get("/drills"); // Remove /api prefix
export const getDrillById = (id: string) => api.get(`/drills/${id}`); // Remove /api prefix

// Attempts
export const submitAttempt = (data: {
  drillId: string;
  answers: Array<{ qid: string; text: string }>;
}) => api.post("/attempts", data); // Remove /api prefix

export const getAttempts = (limit: number = 5) =>
  api.get(`/attempts?limit=${limit}`); // Remove /api prefix

// Logout
export const logoutUser = () => api.post("/auth/logout"); // Remove /api prefix