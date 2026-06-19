import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-[#3DB4F2]">404</h1>
      <p className="mt-4 text-xl text-slate-600 dark:text-slate-300">Halaman tidak ditemukan</p>
      <Link to="/" className="mt-6">
        <Button>Kembali ke Home</Button>
      </Link>
    </div>
  );
}
