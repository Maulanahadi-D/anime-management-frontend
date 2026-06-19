import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-light-border bg-white p-6 shadow-sm dark:border-anilist-border dark:bg-anilist-card">
        <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Register</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Buat akun baru untuk mulai mengelola watchlist</p>
        <RegisterForm />
      </div>
    </div>
  );
}
