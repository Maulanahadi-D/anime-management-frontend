import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../../api/genre.api';
import GenreForm from "./genre/GenreForm";
import Modal from "../ui/Modal";           
import Button from "../ui/Button";         
import Spinner from "../ui/Spinner";       
import EmptyState from '../../components/ui/EmptyState';

function GenreRow({ genre, onEdit, onDelete, isDeleting }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
      <td className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {genre.id}
      </td>
      <td className="px-4 py-3 font-bold text-sm text-slate-700 dark:text-slate-200">
        {genre.genre_name}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="!px-2.5 !py-1 text-xs font-bold"
            onClick={() => onEdit(genre)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            className="!px-2.5 !py-1 text-xs font-bold"
            onClick={() => onDelete(genre)}
            isLoading={isDeleting}
          >
            Hapus
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function GenreManagementTab() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: () => getGenres().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: createGenre,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre berhasil ditambahkan');
      setModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Gagal menambahkan genre'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateGenre(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre berhasil diperbarui');
      setModalOpen(false);
      setEditingGenre(null);
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Gagal memperbarui genre'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGenre,
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre berhasil dihapus');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Gagal menghapus genre'),
    onSettled: () => setDeletingId(null),
  });

  // Sesuaikan dengan bentuk respons asli backend Anda (res.data vs res.data.data)
  const genreList = data?.data ?? data ?? [];

  const handleSubmit = (payload) => {
    if (editingGenre) {
      updateMutation.mutate({ id: editingGenre.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (genre) => {
    if (confirm(`Hapus genre "${genre.genre_name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteMutation.mutate(genre.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingGenre(null);
            setModalOpen(true);
          }}
        >
          + Tambah Genre
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : genreList.length === 0 ? (
        <EmptyState
          title="Belum ada data genre"
          description="Mulai dengan menambahkan genre pertama."
          action={<Button onClick={() => setModalOpen(true)}>Tambah Genre</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151F2E]/30 shadow-sm dark:shadow-none transition-all duration-300">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  ID
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nama Genre
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {genreList.map((genre) => (
                <GenreRow
                  key={genre.id}
                  genre={genre}
                  onEdit={(target) => {
                    setEditingGenre(target);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending && deletingId === genre.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingGenre(null);
        }}
        title={editingGenre ? 'Edit Genre' : 'Tambah Genre Baru'}
        size="sm"
      >
        <GenreForm
          initialData={editingGenre}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingGenre(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}
