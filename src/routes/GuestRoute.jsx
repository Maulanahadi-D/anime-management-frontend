import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function GuestRoute({ children }) {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) return <Spinner />;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
