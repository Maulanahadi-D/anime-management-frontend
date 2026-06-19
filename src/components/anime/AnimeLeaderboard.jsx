import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom'; // FIX: Impor Link untuk rute navigasi detail
import { getGlobalStats } from '../../api/stats.api';
import Spinner from '../ui/Spinner';

export default function AnimeLeaderboard() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['stats', 'global-public'],
    queryFn: () => getGlobalStats().then((res) => res.data),
    staleTime: 10 * 60 * 1000, // Cache 10 menit untuk publik
  });

  const rawData = statsData?.data ?? {};
  const topRatedList = rawData.top_rated_anime?.slice(0, 5) || [];
  const mostWatchedList = rawData.most_watched_anime?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (topRatedList.length === 0 && mostWatchedList.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
      {/* Box Papan Peringkat Rating Tertinggi */}
      <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#151F2E]/40 p-5 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#3DB4F2] mb-4 flex items-center gap-1.5">
          🏆 RATING TERTINGGI (TOP RATED)
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {topRatedList.map((item, index) => (
            <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <span className="text-sm font-black text-slate-400 dark:text-slate-600 w-5 text-center">{index + 1}</span>
              
              {/* FIX: Bungkus gambar dengan Link detail */}
              <Link to={`/anime/${item.id}`} className="shrink-0">
                <img 
                  src={item.cover_image_url} 
                  alt="" 
                  className="h-11 w-8 rounded object-cover border border-slate-100 dark:border-slate-700/30 hover:opacity-80 transition-opacity" 
                  referrerPolicy="no-referrer" 
                />
              </Link>

              <div className="min-w-0 flex-1">
                {/* FIX: Ubah tag <p> menjadi <Link> agar judul bisa diklik langsung */}
                <Link 
                  to={`/anime/${item.id}`} 
                  className="block truncate text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#3DB4F2] dark:hover:text-[#3DB4F2] transition-colors"
                >
                  {item.title}
                </Link>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{item.review_count} Ulasan Komunitas</p>
              </div>
              <span className="rounded bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-500 flex items-center gap-0.5">
                ⭐ {parseFloat(item.avg_rating).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Box Papan Peringkat Paling Banyak Ditonton */}
      <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#151F2E]/40 p-5 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-violet-400 mb-4 flex items-center gap-1.5">
          🔥 PALING POPULER (MOST WATCHED)
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {mostWatchedList.map((item, index) => (
            <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <span className="text-sm font-black text-slate-400 dark:text-slate-600 w-5 text-center">{index + 1}</span>
              
              {/* FIX: Bungkus gambar dengan Link detail */}
              <Link to={`/anime/${item.id}`} className="shrink-0">
                <img 
                  src={item.cover_image_url} 
                  alt="" 
                  className="h-11 w-8 rounded object-cover border border-slate-100 dark:border-slate-700/30 hover:opacity-80 transition-opacity" 
                  referrerPolicy="no-referrer" 
                />
              </Link>

              <div className="min-w-0 flex-1">
                {/* FIX: Ubah tag <p> menjadi <Link> agar judul bisa diklik langsung */}
                <Link 
                  to={`/anime/${item.id}`} 
                  className="block truncate text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-violet-400 dark:hover:text-violet-400 transition-colors"
                >
                  {item.title}
                </Link>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{item.completed_count} Selesai Menonton</p>
              </div>
              <span className="rounded bg-violet-500/10 px-2.5 py-1 text-xs font-black text-violet-400 flex items-center gap-1">
                🔖 {item.watchlist_count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}