import api from './client';

export const getGlobalStats = () => api.get('/stats');
