// ─────────────────────────────────────────────────────────────────────────────
// api.js  — Centralized API service using axios
//
// All backend calls live here so if the URL ever changes,
// you only update it in one place.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';

// Base axios instance pointing at your Express backend
// withCredentials: true → tells the browser to include the JWT cookie in every request
// (the backend sets an httpOnly cookie on login — without this flag it is silently ignored)
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,   // send cookies on every request (needed for JWT auth)
});


// Fetch songs filtered by mood from the backend
// GET /songs?mood=happy → returns array of song objects from MongoDB
export const getSongsByMood = async (mood) => {
  const response = await api.get(`/songs?mood=${mood}`);
  return response.data.songs; // the songs array from your JSON response
};

export const signup = async (username, email, password) => {
  const response = await api.post('/auth/signup', { username, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};
export default api;
