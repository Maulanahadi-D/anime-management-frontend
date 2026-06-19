export default function Button({
  children,
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled,
  ...props
}) {
  const variants = {
    primary:   'bg-[#3DB4F2] hover:bg-[#2da8e8] text-white',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-anilist-card dark:hover:bg-anilist-border dark:text-slate-200',
    danger:    'bg-red-600 hover:bg-red-500 text-white',
    ghost:     'bg-transparent hover:bg-slate-100 text-slate-600 dark:hover:bg-anilist-card dark:text-slate-300',
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}
