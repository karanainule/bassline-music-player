import { motion } from 'framer-motion'

export default function AlbumGrid({ albums, currentAlbumId, onSelectAlbum }) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Featured playlists</h2>
          <p className="text-sm text-slate-500 dark:text-white/50">Tap an album to load the playlist.</p>
        </div>
        <p className="text-xs text-slate-400 dark:text-white/50">{albums.length} collections</p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {albums.map((album) => {
          const isActive = album.id === currentAlbumId
          return (
            <motion.button
              key={album.id}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectAlbum(album.id)}
              className={`group flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition ${
                isActive
                  ? 'border-glow-500/60 bg-white shadow-card dark:bg-white/10'
                  : 'border-slate-200 bg-white hover:border-slate-400 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/30'
              }`}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={album.cover}
                  alt={album.title}
                  loading="lazy"
                  decoding="async"
                  className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent dark:from-ink-900/80" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-slate-900 dark:text-white">{album.title}</p>
                <p className="text-sm text-slate-500 dark:text-white/60">{album.description}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-white/50">
                <span>{album.genre}</span>
                <span>{album.tracks.length} tracks</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
