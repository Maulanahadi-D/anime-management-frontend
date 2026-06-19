import { STATUS_COLORS } from '../../utils/constants';

export default function WatchlistCard({ item, onClick }) {
  const progress = item.episodes
    ? Math.round(((item.episodes_watched || 0) / item.episodes) * 100)
    : 0;

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="flex w-full gap-3 rounded-lg border border-light-border bg-white p-3 text-left transition hover:border-[#3DB4F2]/40 hover:shadow-sm dark:border-anilist-border dark:bg-anilist-card dark:hover:border-[#3DB4F2]/50"
    >
      <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-anilist-border">
        {item.cover_image_url ? (
          <img src={item.cover_image_url} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xl">🎬</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-medium text-slate-800 dark:text-slate-100">{item.title}</h4>
        <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${STATUS_COLORS[item.status] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
          {item.status}
        </span>
        {item.episodes > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{item.episodes_watched || 0} / {item.episodes} eps</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-anilist-border">
              <div className="h-full rounded-full bg-[#3DB4F2]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
