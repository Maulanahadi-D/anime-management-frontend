import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { WATCHLIST_STATUS } from '../../utils/constants';
import { updateWatchlist, removeFromWatchlist } from '../../api/watchlist.api';
import { createReview, updateReview } from '../../api/review.api';

export default function WatchlistUpdateModal({ item, isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  // Mengambil data anime baik dari inner object (item.anime) maupun flat object
  const animeData = item?.anime || item || {};
  const animeId = item?.anime_id || item?.id || animeData?.id;
  const animeTitle = animeData?.title || 'Anime';
  const totalEpisodes = animeData?.episodes || 0;

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: item?.status || 'Watching',
      episodes_watched: item?.episodes_watched || item?.progress || 0,
      rating: item?.user_rating || '',
    },
  });

  // FIX: Memaksa form untuk me-reset nilai inputnya setiap kali modal dibuka dengan data anime baru
  useEffect(() => {
    if (item) {
      reset({
        status: item.status || 'Watching',
        episodes_watched: item.episodes_watched || item.progress || 0,
        rating: item.user_rating || '',
      });
    }
  }, [item, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // 1. Update data watchlist utama ke backend
      await updateWatchlist(item.id, {
        status: data.status,
        episodes_watched: parseInt(data.episodes_watched, 10) || 0,
      });

      // 2. Jika user mengisi rating, kelola pengiriman ulasannya secara aman
      if (data.rating) {
        const rating = parseInt(data.rating, 10);
        if (item.review_id) {
          await updateReview(item.review_id, { rating });
        } else {
          // FIX: Mengamankan anime_id agar tidak undefined sewaktu membuat ulasan baru
          if (!animeId) {
            throw new Error('ID Anime gagal dideteksi oleh sistem frontend.');
          }
          await createReview({ anime_id: parseInt(animeId, 10), rating });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Progres berhasil diperbarui');
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal memperbarui');
    },
  });

  const handleDelete = async () => {
    if (!confirm('Hapus anime ini dari watchlist?')) return;
    setIsDeleting(true);
    try {
      await removeFromWatchlist(item.id);
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Dihapus dari watchlist');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menghapus');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update: ${animeTitle}`}>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <Select label="Status Tontonan" {...register('status')}>
          {WATCHLIST_STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        
        <Input
          label={`Episode Ditonton (max ${totalEpisodes || '?'})`}
          type="number"
          min="0"
          max={totalEpisodes || undefined}
          {...register('episodes_watched')}
        />
        
        <Input
          label="Rating Anda (1-10)"
          type="number"
          min="1"
          max="10"
          placeholder="Opsional"
          {...register('rating')}
        />
        
        <div className="flex justify-between pt-2">
          <Button type="button" variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Hapus
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending}>Simpan</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
