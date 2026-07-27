// ─────────────────────────────────────────────────────────────────────────────
// api.js  — Centralized API service using axios
//
// All backend calls live here so if the URL ever changes,
// you only update it in one place.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';

// Base axios instance pointing at your Express backend
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Fetch songs filtered by mood from the backend
// GET /songs?mood=happy → returns array of song objects from MongoDB
export const getSongsByMood = async (mood) => {
  const response = await api.get(`/songs?mood=${mood}`);
  return response.data.songs; // the songs array from your JSON response
};

export default api;
