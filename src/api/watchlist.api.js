import api from './client';

export const getWatchlistByUser = (userId) => api.get(`/watchlists/user/${userId}`);
export const addToWatchlist = (data) => api.post('/watchlists', data);
export const updateWatchlist = (id, data) => api.put(`/watchlists/${id}`, data);
export const removeFromWatchlist = (id) => api.delete(`/watchlists/${id}`);
