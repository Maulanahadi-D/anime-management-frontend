import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && isAuthenticated && !isAdmin) {
      toast.error('Akses ditolak. Hanya admin yang dapat mengakses halaman ini.');
    }
  }, [isHydrated, isAuthenticated, isAdmin]);

  if (!isHydrated) return <Spinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
