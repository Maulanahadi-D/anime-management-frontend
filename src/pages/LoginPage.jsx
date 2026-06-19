import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-light-border bg-white p-6 shadow-sm dark:border-anilist-border dark:bg-anilist-card">
        <h1 className="mb-1 text-2xl font-bold text-slate-800 dark:text-white">Login</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Masuk ke akun AnimeHub Anda</p>
        <LoginForm />
      </div>
    </div>
  );
}
