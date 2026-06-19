import { create } from 'zustand';
import * as authApi from '../api/auth.api';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('token') || null,
  user: null,
  isLoading: false,
  isHydrated: false,

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  setUser: (user) => set({ user }),

  login: async (credentials) => {
    const { data } = await authApi.login(credentials);
    get().setToken(data.token);
    if (data.user) {
      set({ user: data.user });
    } else {
      const me = await authApi.getMe();
      set({ user: me.data.user });
    }
    return data;
  },

  register: async (formData) => {
    const { data } = await authApi.register(formData);
    get().setToken(data.token);
    set({ user: data.user });
    return data;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout errors
    }
    get().setToken(null);
    set({ user: null });
  },

  hydrate: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isHydrated: true, token: null, user: null });
      return;
    }
    set({ isLoading: true, token });
    try {
      const { data } = await authApi.getMe();
      set({ user: data.user, isHydrated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ token: null, user: null, isHydrated: true, isLoading: false });
    }
  },
}));

export default useAuthStore;
