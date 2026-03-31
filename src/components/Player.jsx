import { formatTime } from '../utils/format.js'
import { IconPause, IconPlay, IconNext, IconPrev, IconMute, IconVolume } from './Icons.jsx'

export default function Player({
  track,
  album,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  progress,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
}) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1
  const progressPercent = Math.min((progress / safeDuration) * 100, 100)

  if (!track) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(1040px,94vw)] -translate-x-1/2">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card backdrop-blur dark:border-white/10 dark:bg-ink-800/90">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={album?.cover}
              alt={album?.title}
              className="h-16 w-16 rounded-2xl object-cover"
              loading="lazy"
            />
            <div>
              <p className="text-sm text-slate-500 dark:text-white/60">Now playing</p>
              <p className="font-display text-base font-semibold text-slate-900 dark:text-white">{track.title}</p>
              <p className="text-xs text-slate-400 dark:text-white/50">{album?.title}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={onPrev}
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-white/70 dark:hover:border-white/40 dark:hover:text-white"
                aria-label="Previous"
              >
                <IconPrev className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onTogglePlay}
                className="rounded-full bg-glow-500 p-3 text-ink-900 shadow-soft transition hover:scale-105"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <IconPause className="h-5 w-5" /> : <IconPlay className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={onNext}
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-white/70 dark:hover:border-white/40 dark:hover:text-white"
                aria-label="Next"
              >
                <IconNext className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/50">
              <span>{formatTime(progress)}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-glow-500 to-glow-400"
                  style={{ width: `${progressPercent}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={safeDuration}
                  value={Math.min(progress, safeDuration)}
                  onChange={(event) => onSeek(Number(event.target.value))}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Seek"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMute}
              className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-white/70 dark:hover:border-white/40 dark:hover:text-white"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <IconMute className="h-4 w-4" />
              ) : (
                <IconVolume className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(volume * 100)}
              onChange={(event) => onVolumeChange(Number(event.target.value) / 100)}
              className="h-2 w-28 cursor-pointer accent-glow-500"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
