import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // 🛠️ STATE BARU: Untuk mengontrol kemunculan Modal Kustom ala AniList
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Deteksi status login lewat localStorage token
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const isLoggedIn = !!token;

  // Fungsi pengubah tema visual (Tailwind CSS Dark Mode)
  const handleThemeClick = (themeName) => {
    const root = window.document.documentElement;
    if (themeName === 'light') {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else if (themeName === 'dark' || themeName === 'contrast') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // 🛠️ FIX UTAMA LOGOUT: Eksekusi pembersihan token secara menyeluruh
  const confirmLogout = () => {
    // 1. Hapus semua variasi nama token yang mungkin dipakai di aplikasi kamu
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.clear(); // Opsional: Bersihkan sisa state lain agar aman saat demo UAS

    // 2. Tutup modal konfirmasi
    setShowLogoutModal(false);

    // 3. Tendang ke halaman login dan paksa reload browser agar state Auth/React Query bersih total
    navigate('/login');
    window.location.href = '/login';
  };

  return (
    <footer className="w-full bg-[#0b1622] text-[#9fadbd] text-xs font-semibold mt-auto border-t border-slate-800/40 transition-colors duration-300 relative">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* ─── GRID KONTEN UTAMA ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Kolom 1: Pemilih Tema Visual */}
          <div className="space-y-3">
            <h4 className="text-[#3DB4F2] font-black uppercase tracking-wider text-[11px]">Site Theme</h4>
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => handleThemeClick('light')}
                className="w-7 h-7 rounded bg-white text-slate-800 flex items-center justify-center font-bold border border-slate-700/20 shadow-xs hover:scale-105 transition-transform"
                title="Light Mode"
              >
                A
              </button>
              <button 
                type="button" 
                onClick={() => handleThemeClick('dark')}
                className="w-7 h-7 rounded bg-[#151f2e] text-slate-200 flex items-center justify-center font-bold border border-slate-700/40 shadow-xs hover:scale-105 transition-transform"
                title="Dark Mode"
              >
                A
              </button>
              <button 
                type="button" 
                onClick={() => handleThemeClick('contrast')}
                className="w-7 h-7 rounded bg-[#0b1622] text-[#3DB4F2] flex items-center justify-center font-bold border border-[#3DB4F2]/30 shadow-xs hover:scale-105 transition-transform"
                title="AnimeHub Mode"
              >
                A
              </button>
            </div>
          </div>

          {/* Kolom 2: Navigasi Aplikasi */}
          <div className="space-y-2.5">
            <h4 className="text-[#3DB4F2] font-black uppercase tracking-wider text-[11px]">Navigation</h4>
            <Link to="/" className="block hover:text-[#3DB4F2] transition-colors">Explore Anime</Link>
            
            {isLoggedIn && (
              <>
                <Link to="/watchlist" className="block hover:text-[#3DB4F2] transition-colors">My Watchlist</Link>
                <Link to="/admin" className="block hover:text-[#3DB4F2] transition-colors">Admin Dashboard</Link>
              </>
            )}
            
            {!isLoggedIn && (
              <Link to="/login" className="block hover:text-[#3DB4F2] transition-colors">Sign In / Register</Link>
            )}
          </div>

          {/* Kolom 3: Kontak & Komunitas */}
          <div className="space-y-2.5">
            <h4 className="text-[#3DB4F2] font-black uppercase tracking-wider text-[11px]">Community</h4>
            <a href="https://www.instagram.com/maulanahadi38/" target="_blank" rel="noreferrer" className="block hover:text-[#3DB4F2] transition-colors">
              Instagram
            </a>
            {/* 🛠️ FIX LANGSUNG BUKA GMAIL WEB */}
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=12450111768@students.uin-suska.ac.id" 
              target="_blank" 
              rel="noreferrer" 
              className="block hover:text-[#3DB4F2] transition-colors truncate"
              title="Kirim email ke Maulana Hadi via Gmail"
            >
              Email: Maulana Hadi
            </a>
          </div>

          {/* Kolom 4: Sistem Akun */}
          <div className="space-y-2.5">
            <h4 className="text-[#3DB4F2] font-black uppercase tracking-wider text-[11px]">Account</h4>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)} // 🛠️ Pemicu Modal Kustom
                className="block text-left text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
              >
                Logout Account →
              </button>
            ) : (
              <span className="block text-[11px] text-slate-500 italic font-medium">Guest Mode</span>
            )}
          </div>

        </div>

        {/* ─── BARIS BAWAH: HAK CIPTA ─── */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#516170]">
          <div className="font-medium text-center sm:text-left">
            &copy; {currentYear} <span className="text-[#3DB4F2] font-bold">AnimeHub</span>. Dikembangkan oleh <span className="text-slate-300 font-bold">Maulana Hadi Darmawan</span>.
          </div>
          <div className="flex items-center gap-2 text-[10px] bg-[#151f2e] px-3 py-1 rounded-md border border-slate-800/50">
            <span className="text-slate-500">Project UAS:</span>
            <span className="text-[#3DB4F2] font-bold">Pemrograman Web (2026)</span>
          </div>
        </div>

      </div>

      {/* ─── 🛠️ MODAL LOGOUT KUSTOM (DESAIN ANILIST `image_d5f1fd.png`) ─── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div 
            className="w-full max-w-sm bg-[#111923] border border-slate-800 rounded-xl shadow-2xl p-5 text-slate-200 transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-wide">Confirm Logout</h3>
              <button 
                type="button" 
                onClick={() => setShowLogoutModal(false)}
                className="text-slate-500 hover:text-slate-300 text-lg transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Isi Deskripsi */}
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Are you sure you want to logout?
            </p>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-[#0b1219] hover:bg-[#151f2e] text-slate-400 hover:text-slate-200 rounded-md text-xs font-bold transition-all border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-4 py-2 bg-[#3DB4F2] hover:bg-[#3DB4F2]/80 text-white rounded-md text-xs font-black shadow-md transition-all"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}