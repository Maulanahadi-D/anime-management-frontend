import { useQuery } from '@tanstack/react-query';
import { getWatchlistByUser } from '../api/watchlist.api';
import useAuth from './useAuth';

export default function useWatchlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: () => getWatchlistByUser(user.id).then((res) => res.data.data),
    enabled: !!user?.id,
  });
}
