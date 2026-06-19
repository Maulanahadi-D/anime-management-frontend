import { useState, useEffect } from 'react'; // 🛠️ FIX: Impor useEffect di sini
import { useQuery } from '@tanstack/react-query';
import { getGlobalStats } from '../../api/stats.api';
import StatCard from '../../components/admin/StatCard';
import AnimeManagementTab from '../../components/admin/AnimeManagementTab';
import GenreManagementTab from '../../components/admin/GenreManagementTab';
import ReviewManagementTab from '../../components/admin/ReviewManagementTab';

const TABS = [
  { key: 'anime', label: 'Kelola Anime' },
  { key: 'genre', label: 'Kelola Genre' },
  { key: 'review', label: 'Moderasi Ulasan' },
];

export default function AdminDashboardPage() {
  // 🛠️ FIX: Menambahkan Judul Tab Dinamis untuk Halaman Admin Dashboard
  useEffect(() => {
    document.title = "AnimeHub - Admin Dashboard";
  }, []);

  const [activeTab, setActiveTab] = useState('anime');

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['stats', 'global'],
    queryFn: () => getGlobalStats().then((res) => res.data),
    staleTime: 5 * 60 * 1000, 
  });

  const rawData = statsData?.data ?? {};
  const overview = rawData.overview;
  const totalGenresCount = rawData.genre_popularity?.length || 0;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Kelola data anime, genre, dan lihat statistik global platform
        </p>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Anime" value={overview?.total_anime} isLoading={statsLoading} icon="🎬" />
        <StatCard label="Total Ulasan" value={overview?.total_reviews} isLoading={statsLoading} icon="📝" />
        <StatCard label="Total Genre" value={totalGenresCount} isLoading={statsLoading} icon="🏷️" />
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              'px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-[#3DB4F2] text-[#3DB4F2]'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div className="pt-2">
        {activeTab === 'anime' && <AnimeManagementTab />}
        {activeTab === 'genre' && <GenreManagementTab />}
        {activeTab === 'review' && <ReviewManagementTab />}
      </div>
    </div>
  );
}