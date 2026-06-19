import { useQuery } from '@tanstack/react-query';
import { getAnimeList } from '../api/anime.api';

export default function useAnimeList(filters) {
  return useQuery({
    queryKey: ['anime', filters],
    queryFn: () => getAnimeList(filters).then((res) => res.data),
    placeholderData: (prev) => prev,
  });
}
