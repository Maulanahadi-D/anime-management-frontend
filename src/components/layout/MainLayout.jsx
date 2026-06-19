import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-light-bg text-slate-800 transition-colors duration-200 dark:bg-anilist-bg dark:text-slate-200">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}