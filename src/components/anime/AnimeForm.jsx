import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGenres } from '../../api/genre.api';

const inputClass = [
  'w-full rounded-md border p-2.5 text-sm transition font-medium focus:outline-none focus:border-[#3DB4F2] focus:ring-1 focus:ring-[#3DB4F2]/20',
  'bg-white text-slate-800 border-slate-200/80',
  'dark:bg-[#0d1728] dark:text-slate-100 dark:border-slate-700/60'
].join(' ');

const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5';

export default function AnimeForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [episodes, setEpisodes] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [type, setType] = useState('TV');
  const [status, setStatus] = useState('Completed');
  const [studio, setStudio] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // FIX: Mengambil data master genre secara reaktif dari backend database
  const { data: genresData, isLoading: isLoadingGenres } = useQuery({
    queryKey: ['genres'],
    queryFn: () => getGenres().then((res) => res.data.data),
  });

  const genres = genresData || [];

useEffect(() => {
  if (initialData) {
    setTitle(initialData.title || '');
    setSynopsis(initialData.synopsis || '');
    setEpisodes(initialData.episodes || '');
    setReleaseYear(initialData.release_year || '');
    setType(initialData.type || 'TV');
    setStatus(initialData.status || 'Completed');
    setStudio(initialData.studio || '');
    setCoverImageUrl(initialData.cover_image_url || '');
    
    if (initialData.genres && genres.length > 0) {
      const currentAnimeGenres = initialData.genres.split(',').map(g => g.trim());
      const matchedGenreIds = genres
        .filter(g => currentAnimeGenres.includes(g.genre_name))
        .map(g => String(g.id));
      setSelectedGenres(matchedGenreIds);
    } else {
      setSelectedGenres([]);
    }
  } else {
    setTitle('');
    setSynopsis('');
    setEpisodes('');
    setReleaseYear('');
    setType('TV');
    setStatus('Completed');
    setStudio('');
    setSelectedGenres([]);
    setCoverImageUrl('');
  }
}, [initialData, genresData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // FIX: Payload disesuaikan mengirim 'genre_ids' berbentuk array integer sesuai spesifikasi Postman
    const payload = {
      title,
      synopsis,
      episodes: episodes ? parseInt(episodes, 10) : null,
      release_year: releaseYear ? parseInt(releaseYear, 10) : null,
      type,
      status,
      studio,
      genre_ids: selectedGenres.map(id => parseInt(id, 10)),
      cover_image_url: coverImageUrl
    };

    onSubmit(payload);
  };

  const handleGenreChange = (e) => {
    const options = e.target.options;
    const value = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedGenres(value);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Judul *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="Contoh: Attack on Titan"
        />
      </div>

      <div>
        <label className={labelClass}>Sinopsis</label>
        <textarea
          rows={4}
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="Tuliskan jalan cerita anime di sini..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Episodes</label>
          <input
            type="number"
            min={0}
            value={episodes}
            onChange={(e) => setEpisodes(e.target.value)}
            className={inputClass}
            placeholder="Contoh: 24"
          />
        </div>
        <div>
          <label className={labelClass}>Tahun Rilis</label>
          <input
            type="number"
            min={1900}
            max={2100}
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            className={inputClass}
            placeholder="Contoh: 2023"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tipe</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            <option value="TV">TV</option>
            <option value="Movie">Movie</option>
            <option value="OVA">OVA</option>
            <option value="Special">Special</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="Completed">Completed</option>
            <option value="Airing">Airing</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Studio</label>
        <input
          type="text"
          value={studio}
          onChange={(e) => setStudio(e.target.value)}
          className={inputClass}
          placeholder="Contoh: MAPPA, Ufotable"
        />
      </div>

      <div>
        <label className={labelClass}>Genre</label>
        {isLoadingGenres ? (
          <div className="text-xs text-slate-400 py-2 animate-pulse">Memuat daftar genre...</div>
        ) : (
          <select
            multiple
            value={selectedGenres}
            onChange={handleGenreChange}
            className={`${inputClass} h-32 scrollbar-thin`}
          >
            {genres.map((g) => (
              <option key={g.id} value={g.id} className="py-1 px-1 rounded my-0.5 checked:bg-[#3DB4F2] checked:text-white">
                {g.genre_name}
              </option>
            ))}
          </select>
        )}
        <span className="block mt-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 italic">
          * Tahan tombol Ctrl (Windows) / Command (Mac) untuk memilih lebih dari 1 genre.
        </span>
      </div>

      <div>
        <label className={labelClass}>Cover Image URL</label>
        <input
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className={inputClass}
          placeholder="Masukkan tautan gambar (Contoh: https://link-gambar.com/cover.jpg)"
        />
        
        {/* FIX: Live Image Preview Box untuk validasi visual admin */}
        {coverImageUrl && (
          <div className="mt-3 flex items-center gap-3 p-2 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <img 
              src={coverImageUrl} 
              alt="Preview" 
              className="h-16 w-11 rounded object-cover border border-slate-200/50 dark:border-slate-700/30"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Pratinjau gambar cover. Pastikan link URL valid dan gambar muncul.
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-md border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-[#3DB4F2] hover:bg-[#3DB4F2]/80 px-5 py-2 text-xs font-bold text-white shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
        >
          {isLoading ? 'Menyimpan...' : initialData ? 'Perbarui Anime' : 'Tambah Anime'}
        </button>
      </div>
    </form>
  );
}