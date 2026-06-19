import { useState } from 'react';
import useWatchlist from '../hooks/useWatchlist';
import WatchlistUpdateModal from '../components/watchlist/WatchlistUpdateModal';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

// Menambahkan komponen SVG inline sederhana untuk tombol view switcher
const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);

const TABS = [
  { key: 'watching', label: 'Watching' },
  { key: 'plan_to_watch', label: 'Plan to Watch' },
  { key: 'completed', label: 'Completed' },
  { key: 'dropped', label: 'Dropped' },
];

export default function WatchlistPage() {
  const { data, isLoading, isError } = useWatchlist();
  const [activeTab, setActiveTab] = useState('watching');
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 max-w-6xl mx-auto mt-6">
        Gagal memuat data watchlist.
      </div>
    );
  }

  const grouped = data?.grouped || {};
  const items = grouped[activeTab] || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 text-slate-700 dark:text-slate-200">
      
      {/* Header & View Switcher */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 bg-[#3DB4F2] rounded-full"></div>
            <h1 className="text-xl font-black tracking-tight uppercase sm:text-2xl text-slate-800 dark:text-slate-100">My Watchlist</h1>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
            {data?.total || 0} anime dalam koleksi Anda
          </p>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-[#111923] p-1 rounded-lg border border-slate-200/50 dark:border-slate-800/60 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-[#3DB4F2] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <TableIcon />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#3DB4F2] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <GridIcon />
          </button>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-6 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = grouped[tab.key]?.length || 0;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${isActive ? 'border-b-[#3DB4F2] text-[#3DB4F2]' : 'border-b-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              {tab.label}
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isActive ? 'bg-[#3DB4F2]/10 text-[#3DB4F2]' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Konten */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-[#151F2E] rounded-xl border border-slate-100 dark:border-none p-4 shadow-sm">
          <EmptyState
            title="Watchlist kosong"
            description={`Belum ada anime dengan status "${TABS.find((t) => t.key === activeTab)?.label}".`}
            action={
              <Link to="/"><Button className="bg-[#3DB4F2] hover:bg-[#3DB4F2]/80 text-white font-bold text-xs">Jelajahi Anime</Button></Link>
            }
          />
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-hidden bg-white dark:bg-[#151F2E] rounded-xl border border-slate-200/60 dark:border-none shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-[#1c283a]/40 border-b border-slate-100 dark:border-slate-800/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 w-32 text-center">Progress</th>
                  <th className="py-3 px-4 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                {items.map((item, index) => {
                  const anime = item.anime || item; 
                  return (
                    <tr key={item.id} className="group hover:bg-slate-50/40 dark:hover:bg-[#1e2b3e]/20 transition-colors">
                      <td className="py-3.5 px-4 text-center text-xs font-bold text-slate-300 dark:text-slate-600">{index + 1}</td>
                      <td className="py-3.5 px-4">
                        <Link to={`/anime/${anime.id || item.anime_id}`} className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#3DB4F2] transition-colors">{anime.title}</Link>
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {item.episodes_watched || 0} / {anime.episodes || '?'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button type="button" onClick={() => setSelectedItem(item)} className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#3DB4F2] rounded shadow-sm">Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => {
            const anime = item.anime || item;
            return (
              <div key={item.id} className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-[#151F2E] border border-slate-200/50 shadow-sm">
                <div className="aspect-[3/4] relative">
                  <img src={anime.cover_image_url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button type="button" onClick={() => setSelectedItem(item)} className="px-3 py-1.5 bg-[#3DB4F2] text-white font-bold text-xs rounded-md">Edit</button>
                  </div>
                </div>
                <div className="p-3">
                  <Link to={`/anime/${anime.id || item.anime_id}`} className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#3DB4F2] line-clamp-1">{anime.title}</Link>
                  <p className="text-[10px] text-slate-400 mt-1">Eps: {item.episodes_watched || 0}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Komponen Modal Bersih */}
      <WatchlistUpdateModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
