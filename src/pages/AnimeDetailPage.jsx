import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // FIX: Ditambahkan useNavigate untuk lempar ke halaman login
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { toast } from 'react-hot-toast'; 
import { STATUS_COLORS } from '../utils/constants';
import { getAnimeById, getRecommendations, addToWatchlist } from "../api/anime.api"; 
import { createReview, getReviews } from "../api/review.api";
import useAuth from '../hooks/useAuth'; // FIX: Impor useAuth untuk mendeteksi status login user

// Komponen Fallback Poster Detail yang Adaptif Light/Dark Mode
function DetailPosterFallback({ title, studio }) {
  return (
    <div className="relative flex h-full w-full min-h-[300px] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-[#1a2744] dark:via-[#151F2E] dark:to-[#0d1728] p-4 border border-slate-200 dark:border-slate-700/30 transition-colors duration-300">
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#3DB4F2]/10 dark:bg-[#3DB4F2]/8 blur-3xl" />
      <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-[#3DB4F2]/5 blur-2xl" />
      {studio && <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3DB4F2] dark:text-[#3DB4F2]/70">{studio}</span>}
      <div className="relative z-10 mt-auto flex flex-col gap-1">
        <span className="text-xs font-black text-[#3DB4F2]/40 dark:text-[#3DB4F2]/30 tracking-widest uppercase">NO POSTER</span>
        <p className="text-sm font-bold leading-tight text-slate-700 dark:text-slate-300 line-clamp-3">{title}</p>
      </div>
    </div>
  );
}

export default function AnimeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // FIX: Inisialisasi navigasi rute
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth(); // FIX: Ambil status login nyata user platform kamu

  const [isImageError, setIsImageError] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watchlistStatus, setWatchlistStatus] = useState("Plan to Watch");
  const [episodesWatched, setEpisodesWatched] = useState(0);

  // State lokal untuk form review baru
  const [newRating, setNewRating] = useState(10);
  const [newComment, setNewComment] = useState("");

  // 1. QUERY DATA ANIME UTAMA
  const { data: animeResponse, isLoading: isAnimeLoading, error: animeError } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => getAnimeById(id).then(res => res.data) 
  });

  // 2. QUERY DATA REVIEWS
const { data: reviewsResponse, isLoading: isReviewsLoading } = useQuery({
  queryKey: ['anime-reviews', id],
  queryFn: () => getReviews({ anime_id: id }).then(res => res.data), // 👈 Menggunakan instance API Railway terpadu
  enabled: !!id,
});

  // 3. QUERY DATA REKOMENDASI BERBASIS GENRE
  const { data: recsResponse } = useQuery({
    queryKey: ["anime-recommendations", id],
    queryFn: () => getRecommendations(id).then((res) => res.data),
  });
  const recommendations = recsResponse?.data || [];

  // 4. LOGIKA MUTASI TOMBOL WATCHLIST
  const watchlistMutation = useMutation({
    mutationFn: (payload) => addToWatchlist(payload), 
    onSuccess: () => {
      toast.success("Watchlist berhasil diperbarui!");
      setIsModalOpen(false); 
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Gagal menyimpan. Pastikan kamu sudah login.");
    },
  });

  // 5. MUTASI UNTUK MENGIRIM REVIEW BARU
  const reviewMutation = useMutation({
    mutationFn: (payload) => createReview(payload),
    onSuccess: () => {
      toast.success("Ulasan kamu berhasil diterbitkan!");
      setNewComment(""); 
      queryClient.invalidateQueries({ queryKey: ['anime-reviews', id] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Gagal mengirim ulasan. Pastikan kamu sudah login.");
    }
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Komentar ulasan tidak boleh kosong!");
      return;
    }
    reviewMutation.mutate({
      anime_id: parseInt(id),
      rating: parseInt(newRating),
      comment: newComment
    });
  };

  const anime = animeResponse?.data; 
  const reviews = reviewsResponse?.data ?? (Array.isArray(reviewsResponse) ? reviewsResponse : []);

  if (isAnimeLoading) return <div className="p-8 text-center text-slate-400">Loading anime detail...</div>;
  if (animeError || !anime) return <div className="p-8 text-center text-red-400">Anime tidak ditemukan.</div>;

  const genres = anime.genres ? anime.genres.split(',').map((g) => g.trim()).filter(Boolean) : [];
  const formattedRating = anime.avg_rating ? Number(anime.avg_rating).toFixed(1) : 'No Rating';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* BANNER BACKDROP */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-200 dark:bg-slate-900">
        {anime.cover_image_url && !isImageError ? (
          <img
            src={anime.cover_image_url}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-110 blur-md opacity-35 dark:opacity-30 select-none pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-[#1a2744] dark:to-[#0b0f19]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent dark:from-[#0b0f19] dark:via-[#0b0f19]/40 to-transparent" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 pb-16 relative z-10 -mt-24 md:-mt-32">
        <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-8 items-start">
          
          {/* POSTER LEFT PANEL */}
          <div className="flex flex-col items-center md:items-stretch w-full max-w-[230px] mx-auto gap-4">
            <div className="w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl bg-white dark:bg-[#151F2E] border border-slate-200 dark:border-slate-800">
              {anime.cover_image_url && !isImageError ? (
                <img src={anime.cover_image_url} alt={anime.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={() => setIsImageError(true)} />
              ) : (
                <DetailPosterFallback title={anime.title} studio={anime.studio} />
              )}
            </div>
            
            {/* FIX 2: Tombol Watchlist Interaktif Menolak User Anonim */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setIsModalOpen(true);
                } else {
                  toast.error("Silakan login terlebih dahulu untuk mengelola watchlist!");
                  navigate('/login');
                }
              }} 
              disabled={watchlistMutation.isPending}
              className="w-full py-3 bg-[#3db4f2] hover:bg-[#2ca3e2] disabled:bg-slate-600 text-white font-semibold rounded-md transition-colors shadow-md text-center text-sm"
            >
              Tambah ke Watchlist
            </button>
          </div>

          {/* DETAILED CONTENT RIGHT PANEL */}
          <div className="pt-4 md:pt-16">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
              {anime.title}
            </h1>

            {/* Scoreboard Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5 bg-[#3DB4F2]/10 border border-[#3DB4F2]/20 px-3 py-1 rounded-md">
                <span className="text-[#3DB4F2] font-black">★</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{formattedRating}</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs">/ 10</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 font-semibold">
                <span className="text-slate-700 dark:text-slate-200 font-bold">{reviews.length}</span> Reviews
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {anime.status && <span className={`rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[anime.status] || 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{anime.status}</span>}
              {anime.type && <span className="rounded bg-slate-200/80 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border border-slate-300/40 dark:border-slate-700/50">{anime.type}</span>}
            </div>

            {/* Metadata Box */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white dark:bg-[#151F2E]/80 border border-slate-200 dark:border-slate-800/60 backdrop-blur-sm mb-6 max-w-xl shadow-sm dark:shadow-none transition-colors duration-300">
              <div>
                <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Studio</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate block">{anime.studio || '-'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Tahun</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">{anime.release_year || '-'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Episodes</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">{anime.episodes ? `${anime.episodes} Eps` : '-'}</span>
              </div>
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {genres.map((genre) => (
                  <span key={genre} className="rounded-full bg-slate-200/60 dark:bg-[#1a2744] border border-slate-300/30 dark:border-[#3DB4F2]/20 px-3 py-0.5 text-xs font-bold text-[#3DB4F2]">{genre}</span>
                ))}
              </div>
            )}

            {/* Synopsis Panel */}
            <div className="grid grid-cols-1 border-t border-slate-200 dark:border-slate-800/80 pt-6 mb-12">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Synopsis</h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl whitespace-pre-line font-medium">{anime.synopsis || `No synopsis available for ${anime.title}.`}</p>
            </div>

            {/* SEKSI REKOMENDASI */}
            <div className="grid grid-cols-1 border-t border-slate-200 dark:border-slate-800/80 pt-6 mb-12">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Recommendations</h2>
              {recommendations.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Belum ada rekomendasi anime serupa untuk saat ini.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {recommendations.map((rec) => (
                    <Link 
                      to={`/anime/${rec.id}`} 
                      key={rec.id} 
                      className="group flex flex-col bg-white dark:bg-[#151F2E] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800/60 hover:border-[#3DB4F2]/40 dark:hover:border-slate-700/60 transition-all duration-300 shadow-sm dark:shadow-none"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <img 
                          src={rec.cover_image_url} 
                          alt={rec.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {rec.type && (
                          <span className="absolute bottom-2 left-2 bg-black/70 text-[10px] text-slate-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {rec.type}
                          </span>
                        )}
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#3DB4F2] dark:group-hover:text-[#3db4f2] transition-colors line-clamp-2 leading-tight">
                          {rec.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SEKSI REVIEW PENGGUNA */}
            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-8 mb-12">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-6">User Reviews</h2>

              {isReviewsLoading ? (
                <div className="text-sm text-slate-400">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="bg-white dark:bg-[#151F2E]/40 border border-slate-200 dark:border-slate-800/60 rounded-lg p-6 text-center shadow-sm">
                  <p className="text-sm text-slate-400">Belum ada review untuk anime ini. Jadilah yang pertama memberikan ulasan!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.slice(0, visibleReviews).map((rev) => (
                    <div key={rev.id} className="bg-white dark:bg-[#151F2E] border border-slate-200 dark:border-slate-800/60 rounded-lg p-4 shadow-sm dark:shadow-none transition-all hover:border-[#3DB4F2]/30 dark:hover:border-slate-700/60 duration-300">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-[#3DB4F2]/15 dark:bg-[#3DB4F2]/20 flex items-center justify-center text-xs font-black text-[#3DB4F2]">
                            {rev.user_id ? `U${rev.user_id}` : 'UR'}
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {rev.user?.username ?? rev.username ?? `User #${rev.user_id || 'Reviewer'}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#0d1728] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-xs font-bold">
                          <span className="text-yellow-500">★</span>
                          <span className="text-slate-700 dark:text-slate-300">{rev.rating}</span>
                          <span className="text-slate-400 dark:text-slate-600">/10</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line pl-9 font-medium">
                        {rev.comment}
                      </p>
                    </div>
                  ))}

                  {/* TOMBOL VIEW MORE */}
                  {reviews.length > visibleReviews && (
                    <button
                      type="button"
                      onClick={() => setVisibleReviews((prev) => prev + 3)}
                      className="mt-2 mx-auto flex items-center gap-1 text-xs font-bold text-[#3DB4F2] hover:text-[#3DB4F2]/80 uppercase tracking-widest bg-white dark:bg-[#3DB4F2]/5 hover:bg-[#3DB4F2]/5 dark:hover:bg-[#3DB4F2]/10 border border-slate-200 dark:border-[#3DB4F2]/20 px-6 py-2.5 rounded-md shadow-sm dark:shadow-none transition-all duration-200"
                    >
                      View More Reviews
                      <svg className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* SEKSI FORM TAMBAH ULASAN NYATA BARU */}
            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">Write a Review</h2>
              
              {/* FIX 1: Membungkus Form Review berdasarkan status Login (isAuthenticated) */}
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-[#151F2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-full sm:w-1/4">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Your Rating</label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0d1728] border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-sm font-semibold text-amber-500 focus:outline-none focus:border-[#3db4f2]"
                      >
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => (
                          <option key={score} value={score}>⭐ {score} / 10</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-4 sm:mt-0">
                        Berikan ulasan objektif mengenai jalan cerita, animasi, scoring musik, maupun pengembangan karakter dari anime ini.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Review Comment</label>
                    <textarea
                      rows="4"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tulis ulasan menarikmu di sini..."
                      className="w-full bg-slate-50 dark:bg-[#0d1728] border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#3db4f2] transition-colors font-medium resize-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={reviewMutation.isPending}
                      className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#3db4f2] hover:bg-[#2ca3e2] disabled:bg-slate-500 text-white rounded-md transition-colors shadow-md"
                    >
                      {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              ) : (
                // Tampilan Fallback Placeholder Cantik jika user belum login
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-[#151F2E]/10 p-8 text-center transition-all">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                    Kamu harus masuk ke akunmu terlebih dahulu untuk bisa menerbitkan ulasan kritik pada anime ini.
                  </p>
                  <Link 
                    to="/login" 
                    className="inline-block px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#3db4f2] hover:bg-[#2ca3e2] text-white rounded-md transition-all duration-200 shadow-sm"
                  >
                    Login Sekarang
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── MODAL ENTRY WATCHLIST POPUP ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white dark:bg-[#111c2c] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-2xl transition-colors duration-300">
            
            <div className="relative h-20 bg-slate-100 dark:bg-slate-900 overflow-hidden px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="relative z-10">
                <span className="text-xs font-bold text-[#3db4f2] uppercase tracking-wider">Update List Entry</span>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white line-clamp-1">{anime.title}</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="relative z-10 text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 dark:bg-[#111c2c]">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={watchlistStatus}
                  onChange={(e) => setWatchlistStatus(e.target.value)}
                  className="w-full bg-white dark:bg-[#152232] border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3db4f2] dark:focus:border-[#3db4f2] transition-colors cursor-pointer font-medium"
                >
                  <option value="Plan to Watch">Plan to Watch</option>
                  <option value="Watching">Watching</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Episode Progress (Max: {anime.episodes || '?'})
                </label>
                <input
                  type="number"
                  min="0"
                  max={anime.episodes || 999}
                  value={episodesWatched}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setEpisodesWatched('');
                    } else {
                      const parsed = parseInt(val, 10) || 0;
                      const clampedValue = Math.max(0, parsed);
                      
                      if (anime.episodes && clampedValue > anime.episodes) {
                        setEpisodesWatched(anime.episodes);
                      } else {
                        setEpisodesWatched(clampedValue);
                      }
                    }
                  }}
                  className="w-full bg-white dark:bg-[#152232] border border-slate-200 dark:border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3db4f2] dark:focus:border-[#3db4f2] transition-colors font-medium"
                />
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-[#0d1622] px-6 py-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-900/60">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={watchlistMutation.isPending}
                onClick={() => watchlistMutation.mutate({
                  anime_id: parseInt(id),
                  status: watchlistStatus,
                  episodes_watched: episodesWatched
                })}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#3db4f2] hover:bg-[#2ca3e2] disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white rounded transition-colors shadow-md"
              >
                {watchlistMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}