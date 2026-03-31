export default function FilterBar({ genres, artists, genre, artist, onGenreChange, onArtistChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Filters</p>
        <p className="text-xs text-slate-500 dark:text-white/50">Narrow down by genre or artist.</p>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-xs text-slate-500 dark:text-white/60">
          Genre
          <select
            value={genre}
            onChange={(event) => onGenreChange(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none dark:border-white/10 dark:bg-ink-800 dark:text-white dark:focus:border-glow-400"
          >
            {genres.map((item) => (
              <option key={item} value={item} className="text-slate-900">
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-500 dark:text-white/60">
          Artist
          <select
            value={artist}
            onChange={(event) => onArtistChange(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none dark:border-white/10 dark:bg-ink-800 dark:text-white dark:focus:border-glow-400"
          >
            {artists.map((item) => (
              <option key={item} value={item} className="text-slate-900">
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
