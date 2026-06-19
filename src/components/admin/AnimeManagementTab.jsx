import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAnimeList, createAnime, updateAnime, deleteAnime } from '../../api/anime.api';
import AnimeForm from '../anime/AnimeForm';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

// 🛠️ SVG INLINE KUSTOM UNTUK TOMBOL SWITCHER
const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);

// 🎬 SUB-KOMPONEN MINI FALLBACK COVER
function AdminCoverFallback({ title }) {
  const initials = title ? title.substring(0, 2).toUpperCase() : 'AN';
  return (
    <div className="h-full w-full flex items-center justify-center rounded bg-slate-100 dark:bg-[#0d1728] border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 select-none">
      {initials}
    </div>
  );
}

// ─── RENDERING LAYOUT 1: ROW TABEL BAWAAN ───
function AdminAnimeRow({ anime, onEdit, onDelete, isDeleting }) {
  const [imgError, setImgError] = useState(false);

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
      <td className="px-4 py-3">
        <div className="h-12 w-8 overflow-hidden rounded shadow-sm">
          {anime.cover_image_url && !imgError ? (
            <img 
              src={anime.cover_image_url} 
              alt="" 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover border border-slate-200/50 dark:border-slate-700/30" 
              onError={() => setImgError(true)}
            />
          ) : (
            <AdminCoverFallback title={anime.title} />
          )}
        </div>
      </td>
      <td className="px-4 py-3 font-bold text-sm text-slate-700 dark:text-slate-200">
        {anime.title}
      </td>
      <td className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] uppercase font-bold tracking-wider">
          {anime.status}
        </span>
      </td>
      <td className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {anime.episodes ? `${anime.episodes} Eps` : '-'}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="!px-2.5 !py-1 text-xs font-bold"
            onClick={() => onEdit(anime)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            className="!px-2.5 !py-1 text-xs font-bold"
            onClick={() => onDelete(anime)}
            isLoading={isDeleting}
          >
            Hapus
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ─── RENDERING LAYOUT 2: POSTER CARD GRID (NEW) ───
function AdminAnimeCard({ anime, onEdit, onDelete, isDeleting }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-white dark:bg-[#151F2E]/40 border border-slate-200/50 dark:border-slate-800/60 shadow-sm transition-all duration-300">
      {/* Visual Poster Cover */}
      <div className="aspect-[3/4] w-full bg-slate-100 dark:bg-[#0d1728] relative overflow-hidden">
        {anime.cover_image_url && !imgError ? (
          <img 
            src={anime.cover_image_url} 
            alt={anime.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <AdminCoverFallback title={anime.title} />
        )}

        {/* 🎬 ACTION CONTROL OVERLAY (Hanya Muncul Pas di-Hover Mouse) */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col gap-2 items-center justify-center p-3 transition-opacity duration-300 backdrop-blur-xs">
          <Button
            variant="primary"
            className="w-24 !py-1.5 text-xs font-bold shadow-md bg-[#3DB4F2] hover:bg-[#3DB4F2]/80 border-none text-white"
            onClick={() => onEdit(anime)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            className="w-24 !py-1.5 text-xs font-bold shadow-md"
            onClick={() => onDelete(anime)}
            isLoading={isDeleting}
          >
            Hapus
          </Button>
        </div>
      </div>

      {/* Teks Identitas Singkat Anime */}
      <div className="p-3 bg-slate-50/50 dark:bg-[#1a2635]/20 flex-1 flex flex-col justify-between">
        <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 line-clamp-1 group-hover:text-[#3DB4F2] transition-colors">
          {anime.title}
        </h3>
        <div className="flex justify-between items-center mt-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
          <span className="uppercase">{anime.status}</span>
          <span className="text-[#3DB4F2] font-black">{anime.episodes ? `${anime.episodes} Eps` : '-'}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Tab Content Element ─── */
export default function AnimeManagementTab() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState(null);
  
  // 🛠️ STATE BARU: ViewMode kontrol switcher ('table' atau 'grid')
  const [viewMode, setViewMode] = useState('table');

  const { data, isLoading } = useQuery({
    queryKey: ['anime', { page: 1, limit: 100 }],
    queryFn: () => getAnimeList({ page: 1, limit: 100 }).then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: createAnime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
      toast.success('Anime berhasil ditambahkan');
      setModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Gagal menambahkan anime'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateAnime(id, formData),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['anime'] });
      queryClient.invalidateQueries({ queryKey: ['anime'] });
      toast.success('Anime berhasil diperbarui');
      setModalOpen(false);
      setEditingAnime(null);
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Gagal memperbarui anime'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
      toast.success('Anime berhasil dihapus');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Gagal menghapus anime'),
  });

  const animeList = data?.data || [];

  const handleSubmit = (formData) => {
    if (editingAnime) {
      updateMutation.mutate({ id: editingAnime.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (anime) => {
    if (confirm(`Hapus "${anime.title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteMutation.mutate(anime.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* CONTROL TOOLBAR: Switcher Layout + Tambah Anime */}
      <div className="flex justify-between items-center">
        {/* 🛠️ SAKLAR BUTTONS: Pengontrol layout mode */}
        <div className="flex items-center bg-slate-100 dark:bg-[#111923] p-1 rounded-lg border border-slate-200/50 dark:border-slate-800/60 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-[#3DB4F2] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Tabel View"
          >
            <TableIcon />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-[#3DB4F2] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Grid Poster View"
          >
            <GridIcon />
          </button>
        </div>

        <Button
          onClick={() => {
            setEditingAnime(null);
            setModalOpen(true);
          }}
          className="bg-[#3DB4F2] hover:bg-[#3DB4F2]/80 text-white font-bold text-xs shadow-md"
        >
          + Tambah Anime
        </Button>
      </div>

      {/* CONDITIONS LOGIC RENDER */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : animeList.length === 0 ? (
        <EmptyState
          title="Belum ada data anime"
          description="Mulai dengan menambahkan anime pertama."
          action={<Button onClick={() => setModalOpen(true)}>Tambah Anime</Button>}
        />
      ) : viewMode === 'table' ? (
        /* ─── LAYOUT MODE 1: TABEL ORIGINAL ─── */
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151F2E]/30 shadow-sm dark:shadow-none transition-all duration-300">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cover</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Judul</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Episodes</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
              {animeList.map((anime) => (
                <AdminAnimeRow 
                  key={anime.id} 
                  anime={anime}
                  onEdit={(target) => {
                    setEditingAnime(target);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ─── LAYOUT MODE 2: MODERASI CARD GRID ADMIN (NEW STYLE) ─── */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {animeList.map((anime) => (
            <AdminAnimeCard 
              key={anime.id}
              anime={anime}
              onEdit={(target) => {
                setEditingAnime(target);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* MODAL INPUT FORM */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAnime(null);
        }}
        title={editingAnime ? 'Edit Anime' : 'Tambah Anime Baru'}
        size="lg"
      >
        <AnimeForm
          initialData={editingAnime}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingAnime(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}