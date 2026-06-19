import API from './client'; // 👈 Ubah jadi huruf besar

export const getReviews = (params) => API.get('/reviews', { params });
export const createReview = (data) => API.post('/reviews', data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);