import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getReviews, deleteReview } from '../../api/review.api';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

export default function ReviewManagementTab() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  // Ambil semua ulasan dari backend (tanpa filter anime_id agar muncul semua)
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews', 'admin-list'],
    queryFn: () => getReviews().then((res) => res.data),
  });

  // Ambil array data ulasan dari respons backend
  const reviewList = reviewsData?.data ?? reviewsData ?? [];

  // Mutasi untuk menghapus ulasan bermasalah
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      // Invalidate cache reviews dan global stats agar angka statistik ikut ter-update
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['stats', 'global'] });
      toast.success('Ulasan berhasil dihapus dari platform');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Gagal menghapus ulasan');
      setDeletingId(null);
    },
  });

  const handleDelete = (review) => {
    if (confirm(`Hapus ulasan dari user untuk anime ini? Tindakan ini tidak dapat dibatalkan.`)) {
      setDeletingId(review.id);
      deleteMutation.mutate(review.id);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  if (reviewList.length === 0) {
    return (
      <EmptyState
        title="Belum ada ulasan pengguna"
        description="Seluruh ulasan/review yang ditulis oleh user akan muncul di sini untuk dimoderasi."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151F2E]/30 shadow-sm dark:shadow-none transition-all duration-300">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors">
            <tr>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Anime ID</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Komentar</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reviewList.map((review) => (
              <tr key={review.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500">
                  #{review.id}
                </td>
                <td className="px-4 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400">
                  Anime #{review.anime_id}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-500">
                    ⭐ {review.rating}/10
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 font-medium max-w-md break-words">
                  "{review.comment}"
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="danger"
                    className="!px-2.5 !py-1 text-xs font-bold"
                    onClick={() => handleDelete(review)}
                    isLoading={deleteMutation.isPending && deletingId === review.id}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}