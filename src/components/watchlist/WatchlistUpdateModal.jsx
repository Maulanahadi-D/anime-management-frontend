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

  // Amankan pembacaan data, fleksibel apakah datanya flat atau nested dari API backend lu
  const animeData = item?.anime || item || {};
  const animeTitle = animeData?.title || item?.title || 'Anime';
  const totalEpisodes = animeData?.episodes || item?.episodes || 0;

  // FIX ABSOLUT: Ambil anime_id murni dari root item, inner object, atau fallback ke item.id jika flat
  const actualAnimeId = item?.anime_id || item?.anime?.id || animeData?.id || item?.id;

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: item?.status || 'Watching',
      episodes_watched: item?.episodes_watched || item?.progress || 0,
      rating: item?.user_rating || '',
    },
  });

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
      // 1. Eksekusi update data watchlist utama (menggunakan primary key ID watchlist)
      await updateWatchlist(item.id, {
        status: data.status,
        episodes_watched: parseInt(data.episodes_watched, 10) || 0,
      });

      // 2. Jika user mengisi rating, proses ulasannya
      if (data.rating) {
        const rating = parseInt(data.rating, 10);
        
        try {
          if (item.review_id) {
            await updateReview(item.review_id, { rating });
          } else {
            // Amankan validasi anime_id sebelum menembak API backend review
            const finalAnimeId = parseInt(actualAnimeId, 10);
            
            if (!finalAnimeId || isNaN(finalAnimeId)) {
              console.error("Gagal memetakan ID Anime untuk ulasan. Data item murni:", item);
              throw new Error('Anime ID tidak valid atau kosong.');
            }

            await createReview({ 
              anime_id: finalAnimeId, 
              rating: rating,
              comment: "Memberikan rating melalui list koleksi."
            });
          }
        } catch (reviewError) {
          // Cegah error review membatalkan atau memicu pop-up merah besar untuk watchlist
          console.error("Gagal memproses rating/review:", reviewError);
          throw new Error(reviewError.response?.data?.error || 'Watchlist aman, namun gagal menyimpan rating.');
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
