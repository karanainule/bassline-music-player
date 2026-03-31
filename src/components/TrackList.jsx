import { motion, AnimatePresence } from 'framer-motion'
import { IconPlay } from './Icons.jsx'

export default function TrackList({ title, subtitle, tracks, currentTrackId, onSelectTrack }) {
  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-white/50">{subtitle}</p>
        </div>
        <p className="text-xs text-slate-400 dark:text-white/50">{tracks.length} songs</p>
      </div>
      <ul className="mt-4 space-y-2">
        <AnimatePresence>
          {tracks.map((track, index) => {
            const isActive = track.id === currentTrackId
            return (
              <motion.li
                key={`${track.albumId}-${track.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
              >
                <button
                  type="button"
                  onClick={() => onSelectTrack(track)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? 'border-glow-500/60 bg-white text-slate-900 shadow-soft dark:bg-white/10 dark:text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isActive
                          ? 'bg-glow-500 text-ink-900'
                          : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/70'
                      }`}
                    >
                      <IconPlay className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{track.title}</p>
                      <p className="text-xs text-slate-500 dark:text-white/50">
                        {track.artist} · {track.albumTitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-white/40">{track.genre}</span>
                </button>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </section>
  )
}
