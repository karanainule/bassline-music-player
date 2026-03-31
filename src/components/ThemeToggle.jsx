import { IconMoon, IconSun } from './Icons.jsx'

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <IconSun className="h-4 w-4" />
      ) : (
        <IconMoon className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'} Mode</span>
    </button>
  )
}
