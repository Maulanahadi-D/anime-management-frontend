import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';

/* ─── Theme hook ─── */
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}

/* ─── Sun icon ─── */
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}

/* ─── Moon icon ─── */
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

/* ─── Theme toggle button ─── */
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-8 w-8 items-center justify-center rounded-md text-anilist-muted transition-colors duration-200 hover:bg-anilist-card hover:text-anilist-accent dark:hover:bg-anilist-border"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/* ─── Nav link styles ─── */
const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
    isActive
      ? 'bg-[#3DB4F2]/15 text-[#3DB4F2]'
      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 dark:text-anilist-muted dark:hover:bg-anilist-border dark:hover:text-slate-200'
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  // ── LOGIKA SMART HIDE ON SCROLL ──
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scroll ke bawah & melewati batas 80px -> Sembunyikan
        setShowNavbar(false);
      } else {
        // Scroll ke atas -> Munculkan kembali
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logout berhasil');
    navigate('/login');
  };

  const links = (
    <>
      <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>
        Explore
      </NavLink>
      {isAuthenticated && (
        <NavLink to="/watchlist" className={navLinkClass} onClick={() => setMenuOpen(false)}>
          My Watchlist
        </NavLink>
      )}
      {isAdmin && (
        <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    // FIX: Mengubah 'sticky' menjadi 'fixed left-0 w-full', serta menambahkan utility transisi & efek translate dorong
    <header 
      className={`fixed top-0 left-0 w-full z-40 border-b border-light-border bg-light-card/90 backdrop-blur dark:border-anilist-border dark:bg-anilist-bg/90 transition-transform duration-300 ease-in-out ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/FullLogo_Transparent.png" 
            alt="AnimeHub Logo" 
            className="h-8 w-auto object-contain" 
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">{links}</nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle isDark={isDark} onToggle={toggle} />

          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-500 dark:text-anilist-muted">
                Hi, <span className="font-medium text-slate-700 dark:text-slate-300">{user?.username}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-anilist-muted dark:hover:bg-anilist-card dark:hover:text-slate-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-anilist-muted dark:hover:bg-anilist-card dark:hover:text-slate-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-[#3DB4F2] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#2da8e8]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle isDark={isDark} onToggle={toggle} />
          <button
            type="button"
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 dark:text-anilist-muted dark:hover:bg-anilist-card"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-light-border bg-light-card px-4 pb-4 pt-3 dark:border-anilist-border dark:bg-anilist-card md:hidden">
          <nav className="flex flex-col gap-0.5">{links}</nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-light-border pt-3 dark:border-anilist-border">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-500 dark:text-anilist-muted">
                  Hi, <span className="font-medium text-slate-700 dark:text-slate-300">{user?.username}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-anilist-muted dark:hover:bg-anilist-border"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-anilist-muted dark:hover:bg-anilist-border"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-[#3DB4F2] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#2da8e8]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}