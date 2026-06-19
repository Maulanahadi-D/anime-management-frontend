import AnimeCard from './AnimeCard';
import SkeletonCard from '../ui/SkeletonCard';
import EmptyState from '../ui/EmptyState';
import { motion } from 'framer-motion';

export default function AnimeGrid({ animeList = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!animeList.length) {
    return (
      <EmptyState
        title="Tidak ada anime ditemukan"
        description="Coba ubah kata kunci pencarian atau filter yang digunakan."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {animeList.map((anime) => (
        <motion.div
          key={anime.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimeCard anime={anime} />
        </motion.div>
      ))}
    </div>
  );
}
