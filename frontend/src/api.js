import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const api = axios.create({ baseURL: API_URL, timeout: 10000 });

export const submitForm = (payload) => api.post("/submit", payload);
export const predict = (payload) => api.post("/predict", payload);
