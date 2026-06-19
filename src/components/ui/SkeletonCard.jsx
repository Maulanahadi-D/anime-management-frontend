export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-md bg-slate-100 dark:bg-anilist-card">
      <div className="aspect-[2/3] w-full bg-slate-200 dark:bg-[#1a2744]" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-[#1a2744]" />
        <div className="h-3 w-3/5 rounded bg-slate-200 dark:bg-[#1a2744]" />
        <div className="flex gap-1 pt-1">
          <div className="h-4 w-12 rounded bg-slate-200 dark:bg-[#1a2744]" />
          <div className="h-4 w-10 rounded bg-slate-200 dark:bg-[#1a2744]" />
        </div>
      </div>
    </div>
  );
}
