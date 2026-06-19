import { useState } from 'react';
import { Link } from 'react-router-dom';
import { STATUS_COLORS } from '../../utils/constants';

function TypographicCoverFallback({ title, studio, releaseYear }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-[#1a2744] dark:via-[#151F2E] dark:to-[#0d1728] p-3 transition-colors duration-300">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#3DB4F2]/10 dark:bg-[#3DB4F2]/8 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-[#3DB4F2]/5 blur-xl" />

      {studio && (
        <span className="relative z-10 truncate text-[9px] font-bold uppercase tracking-[0.2em] text-[#3DB4F2] dark:text-[#3DB4F2]/60">
          {studio}
        </span>
      )}

      <div className="relative z-10 mt-auto">
        <p className="line-clamp-3 text-sm font-bold leading-tight text-slate-800 dark:text-slate-100">
          {title}
        </p>
        {releaseYear && (
          <span className="mt-1.5 block text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            {releaseYear}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AnimeCard({ anime }) {
  const [isImageError, setIsImageError] = useState(false);

  // Memecah list genre dari database backend
  const genres = anime.genres
    ? anime.genres.split(',').map((g) => g.trim()).filter(Boolean)
    : [];

  return (
    <div
      // Container utama menggunakan kelas 'group' agar child-element mendeteksi efek hover cursor
      className="group relative flex flex-col overflow-hidden rounded-md bg-white border border-slate-200/60 dark:border-none dark:bg-[#151F2E] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(61,180,242,0.15)] dark:hover:shadow-[0_0_20px_rgba(61,180,242,0.2)]"
    >
      {/* ── AREA POSTER DENGAN HOVER OVERLAY INTERAKTIF ── */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-[#0d1728]">
        {anime.cover_image_url && !isImageError ? (
          <img
            src={anime.cover_image_url}
            alt={anime.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={() => setIsImageError(true)}
          />
        ) : (
          <TypographicCoverFallback
            title={anime.title}
            studio={anime.studio}
            releaseYear={anime.release_year}
          />
        )}

        {/* BACKDROP PANEL GELAP: Muncul perlahan (fade-in) dari opacity-0 menjadi opacity-100 saat di-hover */}
        <div className="absolute inset-0 bg-[#0b0f19]/90 border border-[#3DB4F2]/30 rounded-t-md p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 backdrop-blur-[2px]">
          
          {/* Bagian Atas: List Genre Lengkap */}
          <div className="space-y-2">
            <span className="block text-[10px] font-black text-[#3DB4F2] uppercase tracking-widest border-b border-slate-800 pb-1">
              Genres
            </span>
            <div className="flex flex-wrap gap-1 max-h-[75px] overflow-y-auto pr-1 scrollbar-thin">
              {genres.length > 0 ? (
                genres.map((g) => (
                  <span
                    key={g}
                    className="rounded bg-[#1a2744] px-2 py-0.5 text-[9px] font-bold text-[#3DB4F2]/90 border border-[#3DB4F2]/10"
                  >
                    {g}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-500">No genres</span>
              )}
            </div>
          </div>

          {/* Bagian Tengah: Sinopsis Tipis Otomatis Terpotong (Line Clamp) */}
          <div className="flex-1 flex flex-col justify-center my-2">
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Synopsis
            </span>
            <p className="text-[11px] leading-relaxed text-slate-300 line-clamp-4 font-medium">
              {anime.synopsis || "No synopsis available for this anime."}
            </p>
          </div>

          {/* Bagian Bawah: Tombol View More Menuju Link Detail */}
          <Link
            to={`/anime/${anime.id}`}
            className="w-full text-center bg-[#3DB4F2] hover:bg-[#3DB4F2]/80 text-white font-bold text-[11px] uppercase tracking-wider py-1.5 rounded transition-colors duration-200 shadow-md"
          >
            View More
          </Link>
        </div>
      </div>

      {/* ── AREA STRIP INFORMASI BAWAH (Tetap Terbaca Saat Tidak Di-hover) ── */}
      <div className="flex flex-1 flex-col gap-1.5 p-3 transition-colors duration-300">
        <Link to={`/anime/${anime.id}`} className="hover:text-[#3DB4F2] transition-colors">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-800 dark:text-slate-100">
            {anime.title}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-1.5 mt-auto">
          {anime.status && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_COLORS[anime.status] || 'bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'}`}
            >
              {anime.status}
            </span>
          )}
          {anime.episodes && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{anime.episodes} eps</span>
          )}
        </div>
      </div>
    </div>
  );
}