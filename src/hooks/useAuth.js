import useAuthStore from '../store/authStore';

export default function useAuth() {
  const store = useAuthStore();
  return {
    ...store,
    isAuthenticated: store.isAuthenticated(),
    isAdmin: store.isAdmin(),
  };
}
