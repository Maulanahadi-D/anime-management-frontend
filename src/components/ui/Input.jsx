export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        className={[
          'w-full rounded-md border px-3 py-2 text-sm transition',
          'bg-white border-light-border text-slate-800 placeholder:text-slate-400',
          'focus:border-[#3DB4F2]/60 focus:outline-none focus:ring-1 focus:ring-[#3DB4F2]/30',
          'dark:bg-anilist-card dark:border-anilist-border dark:text-white dark:placeholder:text-slate-500',
          error ? 'border-red-500 dark:border-red-500' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
