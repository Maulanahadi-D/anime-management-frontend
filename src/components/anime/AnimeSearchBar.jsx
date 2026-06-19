import { useEffect, useState } from 'react';

export default function AnimeSearchBar({ value, onChange }) {
  const [local, setLocal] = useState(value);

  useEffect(() => { setLocal(value); }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(timer);
  }, [local, value, onChange]);

  return (
    <div className="relative flex-1">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        placeholder="Cari judul anime..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className={[
          'w-full rounded-md border py-2 pl-9 pr-3 text-sm transition',
          'bg-white border-light-border text-slate-800 placeholder:text-slate-400',
          'focus:border-[#3DB4F2]/60 focus:outline-none focus:ring-1 focus:ring-[#3DB4F2]/30',
          'dark:bg-anilist-card dark:border-anilist-border dark:text-slate-200 dark:placeholder:text-slate-500',
          'dark:focus:border-[#3DB4F2]/50',
        ].join(' ')}
      />
    </div>
  );
}
