import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGenres } from '../../api/genre.api';
import { ANIME_STATUS } from '../../utils/constants';

const filterSelectClass = [
  'rounded-md border py-2 pl-3 pr-8 text-sm transition appearance-none cursor-pointer w-full',
  'bg-white border-slate-200 text-slate-700 font-medium', 
  'hover:border-[#3DB4F2]/40',
  'focus:border-[#3DB4F2]/60 focus:outline-none focus:ring-1 focus:ring-[#3DB4F2]/30',
  'dark:bg-[#0d1728] dark:border-anilist-border dark:text-slate-300', 
  'dark:hover:border-[#3DB4F2]/40',
].join(' ');

export default function AnimeFilters({ filters, onChange }) {
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: () => getGenres().then((res) => res.data.data),
  });

  const genres = genresData || [];
  const activeGenres = filters.genre ? filters.genre.split(',').filter(Boolean) : [];
  const hasActive = filters.status || activeGenres.length > 0;

// Efek pengaman: Tutup dropdown secara otomatis jika pengguna mengklik area luar menu
  useEffect(() => {
    function handleClickOutside(event) {
      // PERBAIKAN: Bersihkan dari .ref agar hanya membaca elemen dropdownRef yang asli
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGenreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenreToggle = (genreName) => {
    let nextGenres = [...activeGenres];
    if (nextGenres.includes(genreName)) {
      nextGenres = nextGenres.filter((name) => name !== genreName);
    } else {
      nextGenres.push(genreName);
    }
    onChange({ ...filters, genre: nextGenres.join(','), page: 1 });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      
      {/* 1. FILTER DROPDOWN STATUS (Bawaan Asli Kamu) */}
      <div className="relative min-w-[140px]">
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value, page: 1 })}
          className={filterSelectClass}
        >
          <option value="">Semua Status</option>
          {ANIME_STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <ChevronIcon />
      </div>

      {/* 2. CUSTOM MULTI-SELECT DROPDOWN GENRE (Gaya Eksklusif AniList) */}
      <div className="relative min-w-[180px]" ref={dropdownRef}>
        
        {/* Kotak Utama / Pemicu Dropdown */}
        <div
          onClick={() => setIsGenreOpen(!isGenreOpen)}
          className={`rounded-md border py-2 pl-3 pr-8 text-sm transition cursor-pointer flex items-center justify-between select-none
            ${isGenreOpen ? 'border-[#3DB4F2] ring-1 ring-[#3DB4F2]/30' : 'border-slate-200 dark:border-anilist-border'}
            bg-white text-slate-700 font-medium dark:bg-[#0d1728] dark:text-slate-300 hover:border-[#3DB4F2]/40`}
        >
          <span className="truncate max-w-[140px]">
            {activeGenres.length === 0
              ? 'Semua Genre'
              : `Genre (${activeGenres.length})`}
          </span>
          {/* Efek rotasi panah: Berputar terbalik 180 derajat saat dropdown terbuka */}
          <div className={`transition-transform duration-200 ${isGenreOpen ? 'rotate-180 text-[#3DB4F2]' : 'text-slate-400'}`}>
            <ChevronIcon embedded={true} />
          </div>
        </div>

        {/* PANEL EXPANDABLE MENU: Meluncur turun secara absolut jika isGenreOpen bernilai true */}
        {isGenreOpen && (
          <div className="absolute left-0 mt-1.5 w-[280px] sm:w-[320px] max-h-[260px] overflow-y-auto rounded-lg shadow-xl border border-slate-200 bg-white p-3 z-50 dark:border-slate-800/80 dark:bg-[#111625] scrollbar-thin transition-all">
            <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">
              Pilih Genre
            </span>
            
            {/* Grid berisi tombol-tombol genre di dalam dropdown */}
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => {
                const isSelected = activeGenres.includes(g.genre_name);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleGenreToggle(g.genre_name)}
                    className={`rounded px-2.5 py-1 text-xs font-bold transition-all duration-150 border ${
                      isSelected
                        ? 'bg-[#3DB4F2] text-white border-[#3DB4F2] shadow-[0_2px_8px_rgba(61,180,242,0.25)]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#3DB4F2]/30 dark:bg-[#1a2744]/60 dark:text-[#3DB4F2]/80 dark:border-[#3DB4F2]/5 dark:hover:border-[#3DB4F2]/40'
                    }`}
                  >
                    {g.genre_name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. TOMBOL RESET FILTER */}
      {hasActive && (
        <button
          type="button"
          onClick={() => onChange({ ...filters, status: '', genre: '', page: 1 })}
          className="flex items-center gap-1 rounded-md border border-[#3DB4F2]/25 bg-[#3DB4F2]/10 px-3 py-2 text-xs font-bold text-[#3DB4F2] transition hover:bg-[#3DB4F2]/20 shadow-sm"
        >
          Reset
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}

    </div>
  );
}

function ChevronIcon({ embedded = false }) {
  if (embedded) {
    return (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    );
  }
  return (
    <svg
      className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}