import { useState, useEffect } from 'react'; 
import { useQuery } from '@tanstack/react-query'; 
import { Link } from 'react-router-dom';
import useAnimeList from '../hooks/useAnimeList';
import AnimeSearchBar from '../components/anime/AnimeSearchBar';
import AnimeFilters from '../components/anime/AnimeFilters';
import AnimeGrid from '../components/anime/AnimeGrid';
import Button from '../components/ui/Button';
import AnimeLeaderboard from '../components/anime/AnimeLeaderboard';

/* ─── Sidebar placeholder cards ─── */

function SidebarCard({ title, children }) {
  return (
    <div className="overflow-hidden rounded-md bg-white border border-slate-200/80 dark:border-none dark:bg-[#151F2E] transition-colors duration-300">
      <div className="border-b border-slate-100 dark:border-[#1e2d45] px-4 py-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#3DB4F2]">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ActivityItem({ title, action, time, cover_image_url }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-start gap-3 py-2.5">
      {/* Kotak Gambar Poster Otomatis Muncul */}
      <div className="mt-0.5 h-9 w-7 shrink-0 rounded bg-slate-100 dark:bg-[#1a2744] overflow-hidden border border-slate-200/40 dark:border-slate-800 flex items-center justify-center">
        {cover_image_url && !imgError ? (
          <img
            src={cover_image_url}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          // Jika gambar kosong atau error, tampilkan inisial huruf judul animenya
          <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">
            {title ? title.substring(0, 2) : 'AN'}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-300">{title}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">{action} · {time}</p>
      </div>
    </div>
  );
}

function UpcomingItem({ title, date, studio, cover_image_url }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* Kotak Gambar/Poster Mini */}
      <div className="h-9 w-7 shrink-0 rounded bg-slate-100 dark:bg-[#1a2744] overflow-hidden border border-slate-200/40 dark:border-slate-800 flex items-center justify-center relative group">
        {cover_image_url && !imgError ? (
          <>
            <img
              src={cover_image_url}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
            {/* Overlay tahun di atas gambar */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              {/* 🛠️ FIX STYLE: Mengecilkan font tracking agar angka tahun '2027' muat */}
              <span className="text-[7.5px] font-black text-[#3DB4F2] tracking-tighter">{date}</span>
            </div>
          </>
        ) : (
          // Fallback jika tidak ada cover image
          <div className="flex h-full w-full items-center justify-center text-[8px] font-black text-[#3DB4F2] tracking-tighter">
            {date}
          </div>
        )}
      </div>

      {/* Info Teks Judul & Studio */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-300">{title}</p>
        <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{studio}</p>
      </div>
    </div>
  );
}

// 🏆 MINI FALLBACK POSTER KHUSUS UNTUK ITEM SIDEBAR TOP 10
function MiniCoverFallback({ title }) {
  const initials = title ? title.substring(0, 2).toUpperCase() : 'AN';
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#1a2744] dark:to-[#0d1728] select-none text-[10px] font-black text-slate-400 dark:text-slate-500/80 tracking-wider">
      {initials}
    </div>
  );
}

// 🎯 KOMPONEN INDIVIDUAL BARIS TOP 10
function TopAnimeRowItem({ item, index }) {
  const [imgError, setImgError] = useState(false);
  
  const formattedScore = item.avg_rating ? Number(item.avg_rating).toFixed(1) : '0.0';
  const firstGenre = item.genres ? item.genres.split(',')[0] : '';

  return (
    <Link
      to={`/anime/${item.id}`}
      className="flex items-center gap-3 group/item transition-all py-1"
    >
      <span className={`w-6 text-center text-lg font-black tracking-tight select-none
        ${index === 0 ? 'text-yellow-500 text-xl' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-600' : 'text-slate-400/50 dark:text-slate-600'}`}
      >
        #{index + 1}
      </span>

      <div className="h-11 w-8 shrink-0 rounded bg-slate-100 dark:bg-[#0d1728] overflow-hidden border border-slate-200/40 dark:border-slate-800 flex items-center justify-center">
        {item.cover_image_url && !imgError ? (
          <img
            src={item.cover_image_url}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover group-hover/item:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <MiniCoverFallback title={item.title} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200 group-hover/item:text-[#3DB4F2] transition-colors">
          {item.title || 'Untitled Anime'}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-semibold">
          <span className="text-amber-500 font-bold">★ {formattedScore}</span>
          <span>·</span>
          <span className="uppercase">{item.type || 'TV'}</span>
          {firstGenre && (
            <>
              <span>·</span>
              <span className="text-[#3DB4F2]/80 font-medium">{firstGenre}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// 🏆 KOMPONEN SIDEBAR UTAMA YANG DI-MAP
function TopTenAnimeSidebar() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const { data: topResponse, isLoading, isError } = useQuery({
    queryKey: ['top-10-anime'],
    queryFn: () => fetch(`${baseUrl}/anime/top-10`) 
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .catch(() => ({ success: false, data: [] }))
  });

  const topItems = topResponse?.data || [];

  return (
    <SidebarCard title="Top 10 Anime">
      {isLoading ? (
        <div className="text-xs text-slate-400 py-2 animate-pulse">Loading scoreboard...</div>
      ) : isError || topItems.length === 0 ? (
        <div className="text-[11px] text-slate-500 py-2 italic">Belum ada data peringkat.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {topItems.map((item, index) => (
            <TopAnimeRowItem key={item.id || index} item={item} index={index} />
          ))}
        </div>
      )}
    </SidebarCard>
  );
}

// 🏆 KOMPONEN SIDEBAR COMMUNITY ACTIVITY DINAMIS
function CommunityActivitySidebar() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const { data: activityResponse, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => fetch(`${baseUrl}/anime/recent-activity`) 
      .then(res => res.ok ? res.json() : { data: [] })
      .catch(() => ({ data: [] }))
  });

  const items = activityResponse?.data || [];

  return (
    <SidebarCard title="Community Activity">
      {isLoading ? (
        <div className="text-xs text-slate-400 py-2 animate-pulse">Loading activity...</div>
      ) : items.length === 0 ? (
        <div className="text-[11px] text-slate-500 py-2 italic">Belum ada aktivitas ulasan.</div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-[#1e2d45]">
          {items.map((item, index) => (
            <ActivityItem 
              key={index} 
              title={item.title} 
              cover_image_url={item.cover_image_url}
              action={`Memberikan rating ★${item.rating}`} 
              time="Baru saja" 
            />
          ))}
        </div>
      )}
    </SidebarCard>
  );
}

//  KOMPONEN SIDEBAR UPCOMING RELEASES DINAMIS
function UpcomingReleasesSidebar() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const { data: upcomingResponse, isLoading } = useQuery({
    queryKey: ['upcoming-releases'],
    queryFn: () => fetch(`${baseUrl}/anime/upcoming`) 
      .then(res => res.ok ? res.json() : { data: [] })
      .catch(() => ({ data: [] }))
  });

  const items = upcomingResponse?.data || [];

  // 🛠️ FIX UTAMA: Fungsi untuk menentukan teks label di dalam kotak poster
  const getReleaseLabel = (item) => {
    // Jika ada data release_year, tampilkan tahunnya langsung (Contoh: 2027)
    if (item.release_year) {
      return String(item.release_year);
    }
    // Jika suatu saat kamu pakai release_date lengkap, ini fallback bulannya
    if (item.release_date) {
      const date = new Date(item.release_date);
      return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    }
    return 'TBA'; // To Be Announced jika kosong
  };

  return (
    <SidebarCard title="Upcoming Releases">
      {isLoading ? (
        <div className="text-xs text-slate-400 py-2 animate-pulse">Loading releases...</div>
      ) : items.length === 0 ? (
        <div className="text-[11px] text-slate-500 py-2 italic">Belum ada jadwal rilis mendatang.</div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-[#1e2d45]">
          {items.map((item) => (
            <UpcomingItem 
              key={item.id} 
              title={item.title} 
              date={getReleaseLabel(item)} // 🛠️ Menggunakan fungsi label baru
              studio={item.studio || 'Unknown Studio'} 
              cover_image_url={item.cover_image_url}
            />
          ))}
        </div>
      )}
    </SidebarCard>
  );
}

/* ─── Main page ─── */

export default function HomePage() {
  useEffect(() => {
    document.title = "AnimeHub - Explore";
  }, []);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    genre: '',
    page: 1,
    limit: 20,
  });

  const { data, isLoading, isError } = useAnimeList(filters);
  const animeList = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="flex gap-6 lg:items-start">
      {/* ── Main column (75%) ── */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Explore Anime</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Temukan anime favoritmu dari katalog kami</p>
        </div>

        {!filters.search && !filters.status && !filters.genre && filters.page === 1 && (
          <AnimeLeaderboard />
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-2 pt-2">
          <AnimeSearchBar
            value={filters.search}
            onChange={(search) => setFilters((f) => ({ ...f, search, page: 1 }))}
          />
          <AnimeFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Error state */}
        {isError && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Gagal memuat data anime. Pastikan koneksi backend berjalan dengan benar.
          </div>
        )}

        {/* Grid Judul Koleksi */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {filters.search || filters.genre || filters.status ? 'Hasil Pencarian' : 'Semua Katalog Anime'}
          </h2>
          <AnimeGrid animeList={animeList} isLoading={isLoading} />
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              disabled={filters.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            >
              ← Sebelumnya
            </Button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={filters.page >= pagination.totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Selanjutnya →
            </Button>
          </div>
        )}
      </div>

      {/* ── Sidebar (25%) ── */}
      <aside className="hidden w-64 shrink-0 space-y-4 lg:block xl:w-72">
        <TopTenAnimeSidebar />
        <CommunityActivitySidebar />
        <UpcomingReleasesSidebar />
      </aside>
    </div>
  );
}