import ThemeToggle from './ThemeToggle.jsx'
import { IconSearch } from './Icons.jsx'

export default function Header({ appName, query, onQueryChange, theme, onToggleTheme, totalTracks }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-white/5 dark:bg-ink-900/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-100 p-2 shadow-soft dark:bg-white/10">
            <img src="/img/logo.svg" alt={`${appName} logo`} className="h-full w-full" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">{appName}</p>
            <p className="text-sm text-slate-500 dark:text-white/60">{totalTracks} tracks ready to play</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <label className="relative flex-1 sm:max-w-sm">
            <span className="sr-only">Search songs</span>
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/50" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search songs, albums, or artists"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-glow-500 dark:focus:ring-glow-500/30"
            />
          </label>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  )
}
