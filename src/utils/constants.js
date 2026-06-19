export const ANIME_STATUS = ['Airing', 'Completed', 'Upcoming'];
export const ANIME_TYPES = ['TV', 'Movie', 'OVA', 'Special'];
export const WATCHLIST_STATUS = ['Plan to Watch', 'Watching', 'Completed', 'Dropped'];

/* Status badge colors — work in both light and dark */
export const STATUS_COLORS = {
  Airing:          'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Completed:       'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  Upcoming:        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Watching:        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'Plan to Watch': 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
  Dropped:         'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
};
