import api from './client';

// ── FUNGSI UTAMA ANIME ──
export const getAnimeList = (params) => api.get('/anime', { params });
export const getAnimeById = (id) => api.get(`/anime/${id}`);
export const createAnime = (animeData) => api.post('/anime', animeData);
export const updateAnime = (id, animeData) => api.put(`/anime/${id}`, animeData);
export const deleteAnime = (id) => api.delete(`/anime/${id}`);

// ── FITUR TAMBAHAN (REKOMENDASI & WATCHLIST) ──
export const getRecommendations = (id) => api.get(`/anime/${id}/recommendations`);
export const addToWatchlist = (watchlistData) => api.post('/watchlist', watchlistData);