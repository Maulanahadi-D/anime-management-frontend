import api from './client';

export const getGenres = () => api.get('/genres');
export const createGenre = (payload) => api.post('/genres', payload);
export const updateGenre = (id, payload) => api.put(`/genres/${id}`, payload);
export const deleteGenre = (id) => api.delete(`/genres/${id}`);
