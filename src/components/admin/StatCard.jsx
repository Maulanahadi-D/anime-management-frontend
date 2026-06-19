export default function StatCard({ label, value, icon, isLoading }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151F2E]/30 p-4 shadow-sm dark:shadow-none transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {icon && <span className="text-lg leading-none">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-extrabold text-slate-800 dark:text-white">
        {isLoading ? '—' : value ?? 0}
      </p>
    </div>
  );
}