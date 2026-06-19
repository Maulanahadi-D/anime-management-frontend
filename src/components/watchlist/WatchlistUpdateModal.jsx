import { useState } from 'react';
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
  const { register, handleSubmit } = useForm({
    defaultValues: {
      status: item?.status || 'Watching',
      episodes_watched: item?.episodes_watched || 0,
      rating: item?.user_rating || '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      await updateWatchlist(item.id, {
        status: data.status,
        episodes_watched: parseInt(data.episodes_watched, 10),
      });
      if (data.rating) {
        const rating = parseInt(data.rating, 10);
        if (item.review_id) {
          await updateReview(item.review_id, { rating });
        } else {
          await createReview({ anime_id: item.anime_id, rating });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Progres berhasil diperbarui');
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Gagal memperbarui');
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Update: ${item.title}`}>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <Select label="Status Tontonan" defaultValue={item.status} {...register('status')}>
          {WATCHLIST_STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Input
          label={`Episode Ditonton (max ${item.episodes || '?'})`}
          type="number"
          min="0"
          max={item.episodes || undefined}
          defaultValue={item.episodes_watched || 0}
          {...register('episodes_watched')}
        />
        <Input
          label="Rating Anda (1-10)"
          type="number"
          min="1"
          max="10"
          defaultValue={item.user_rating || ''}
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
