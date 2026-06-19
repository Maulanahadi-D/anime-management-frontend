import { useState, useEffect } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

export default function GenreForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [genreName, setGenreName] = useState('');
  const [error, setError] = useState('');

  // Sinkronkan form setiap kali modal dibuka untuk genre yang berbeda (atau mode tambah baru)
  useEffect(() => {
    setGenreName(initialData?.genre_name ?? '');
    setError('');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = genreName.trim();
    if (!trimmed) {
      setError('Nama genre tidak boleh kosong');
      return;
    }

    onSubmit({ genre_name: trimmed });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama Genre"
        value={genreName}
        onChange={(e) => {
          setGenreName(e.target.value);
          if (error) setError('');
        }}
        error={error}
        placeholder="Contoh: Action, Romance, Isekai"
        autoFocus
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Simpan Perubahan' : 'Tambah Genre'}
        </Button>
      </div>
    </form>
  );
}
