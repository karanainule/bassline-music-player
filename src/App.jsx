import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import FilterBar from './components/FilterBar.jsx'
import Player from './components/Player.jsx'
import { getLibrary } from './services/libraryApi.js'
import { clamp, normalizeText } from './utils/format.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'

const AlbumGrid = lazy(() => import('./components/AlbumGrid.jsx'))
const TrackList = lazy(() => import('./components/TrackList.jsx'))

const prefersDark =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false

export default function App() {
  const appName = import.meta.env.VITE_APP_NAME || 'Bassline'
  const [library, setLibrary] = useState({ albums: [] })
  const [status, setStatus] = useState('loading')
  const [query, setQuery] = useLocalStorage('bassline_query', '')
  const [genre, setGenre] = useLocalStorage('bassline_genre', 'All')
  const [artist, setArtist] = useLocalStorage('bassline_artist', 'All')
  const [theme, setTheme] = useLocalStorage('bassline_theme', prefersDark ? 'dark' : 'light')
  const [currentAlbumId, setCurrentAlbumId] = useLocalStorage('bassline_album', '')
  const [currentTrackId, setCurrentTrackId] = useLocalStorage('bassline_track', '')
  const [volume, setVolume] = useLocalStorage('bassline_volume', 0.8)
  const [isMuted, setIsMuted] = useLocalStorage('bassline_muted', false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    let active = true
    async function loadLibrary() {
      setStatus('loading')
      try {
        const data = await getLibrary()
        if (active) {
          setLibrary(data)
          setStatus('ready')
        }
      } catch (error) {
        if (active) setStatus('error')
      }
    }

    loadLibrary()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!library.albums.length) return
    const fallbackAlbum = library.albums[0]
    const nextAlbum = library.albums.find((album) => album.id === currentAlbumId) || fallbackAlbum
    if (!currentAlbumId || currentAlbumId !== nextAlbum.id) {
      setCurrentAlbumId(nextAlbum.id)
    }

    const fallbackTrack = nextAlbum.tracks[0]
    const nextTrack = nextAlbum.tracks.find((track) => track.id === currentTrackId) || fallbackTrack
    if (!currentTrackId || currentTrackId !== nextTrack.id) {
      setCurrentTrackId(nextTrack.id)
    }
  }, [library.albums, currentAlbumId, currentTrackId, setCurrentAlbumId, setCurrentTrackId])

  const allTracks = useMemo(() => {
    return library.albums.flatMap((album) =>
      album.tracks.map((track) => ({
        ...track,
        albumId: album.id,
        albumTitle: album.title,
        albumCover: album.cover,
        genre: album.genre,
        artist: track.artist || album.artist,
      }))
    )
  }, [library.albums])

  const genres = useMemo(() => {
    const items = new Set(library.albums.map((album) => album.genre))
    return ['All', ...Array.from(items)]
  }, [library.albums])

  const artists = useMemo(() => {
    const items = new Set(allTracks.map((track) => track.artist))
    return ['All', ...Array.from(items)]
  }, [allTracks])

  const currentAlbum = useMemo(() => {
    return library.albums.find((album) => album.id === currentAlbumId) || library.albums[0]
  }, [library.albums, currentAlbumId])

  const currentAlbumTracks = useMemo(() => {
    if (!currentAlbum) return []
    return currentAlbum.tracks.map((track) => ({
      ...track,
      albumId: currentAlbum.id,
      albumTitle: currentAlbum.title,
      albumCover: currentAlbum.cover,
      genre: currentAlbum.genre,
      artist: track.artist || currentAlbum.artist,
    }))
  }, [currentAlbum])

  const normalizedQuery = normalizeText(query)
  const filteredTracks = useMemo(() => {
    return allTracks.filter((track) => {
      const searchable = `${track.title} ${track.artist} ${track.albumTitle} ${track.genre}`.toLowerCase()
      const matchesQuery = normalizedQuery ? searchable.includes(normalizedQuery) : true
      const matchesGenre = genre === 'All' || track.genre === genre
      const matchesArtist = artist === 'All' || track.artist === artist
      return matchesQuery && matchesGenre && matchesArtist
    })
  }, [allTracks, normalizedQuery, genre, artist])

  const isFiltered = normalizedQuery.length > 0 || genre !== 'All' || artist !== 'All'
  const displayedTracks = isFiltered ? filteredTracks : currentAlbumTracks

  const currentTrack = useMemo(() => {
    if (!currentAlbum) return null
    return (
      allTracks.find((track) => track.albumId === currentAlbumId && track.id === currentTrackId) ||
      currentAlbumTracks[0] ||
      null
    )
  }, [allTracks, currentAlbum, currentAlbumId, currentTrackId, currentAlbumTracks])

  const handleSelectAlbum = useCallback(
    (albumId) => {
      const nextAlbum = library.albums.find((album) => album.id === albumId)
      if (!nextAlbum) return
      setCurrentAlbumId(albumId)
      setCurrentTrackId(nextAlbum.tracks[0]?.id || '')
      setIsPlaying(false)
    },
    [library.albums, setCurrentAlbumId, setCurrentTrackId]
  )

  const handleSelectTrack = useCallback(
    (track) => {
      if (!track) return
      setCurrentAlbumId(track.albumId)
      setCurrentTrackId(track.id)
      setIsPlaying(true)
    },
    [setCurrentAlbumId, setCurrentTrackId]
  )

  const handlePrev = useCallback(() => {
    if (!currentAlbumTracks.length) return
    const currentIndex = currentAlbumTracks.findIndex((track) => track.id === currentTrackId)
    const prevIndex = currentIndex <= 0 ? currentAlbumTracks.length - 1 : currentIndex - 1
    const prevTrack = currentAlbumTracks[prevIndex]
    if (prevTrack) {
      setCurrentTrackId(prevTrack.id)
      setIsPlaying(true)
    }
  }, [currentAlbumTracks, currentTrackId, setCurrentTrackId])

  const handleNext = useCallback(() => {
    if (!currentAlbumTracks.length) return
    const currentIndex = currentAlbumTracks.findIndex((track) => track.id === currentTrackId)
    const nextIndex = currentIndex >= currentAlbumTracks.length - 1 ? 0 : currentIndex + 1
    const nextTrack = currentAlbumTracks[nextIndex]
    if (nextTrack) {
      setCurrentTrackId(nextTrack.id)
      setIsPlaying(true)
    }
  }, [currentAlbumTracks, currentTrackId, setCurrentTrackId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    audio.src = encodeURI(currentTrack.src)
    audio.load()
    setProgress(0)
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }, [currentTrack, isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : clamp(volume, 0, 1)
  }, [volume, isMuted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0)
    }

    const handleLoaded = () => {
      setDuration(audio.duration || 0)
    }

    const handleEnded = () => {
      handleNext()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoaded)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoaded)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [handleNext])

  const handleSeek = useCallback(
    (value) => {
      const audio = audioRef.current
      if (!audio) return
      audio.currentTime = clamp(value, 0, duration || 0)
      setProgress(audio.currentTime)
    },
    [duration]
  )

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  const handleVolumeChange = useCallback(
    (value) => {
      const nextValue = clamp(value, 0, 1)
      setVolume(nextValue)
      if (nextValue > 0 && isMuted) {
        setIsMuted(false)
      }
    },
    [setVolume, isMuted, setIsMuted]
  )

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [setIsMuted])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-ink-900 dark:text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,242,196,0.2),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(124,242,196,0.15),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[45vw] bg-[radial-gradient(circle_at_top,_rgba(155,231,255,0.2),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(155,231,255,0.18),_transparent_60%)]" />
        <div className="relative z-10">
          <Header
            appName={appName}
            query={query}
            onQueryChange={setQuery}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            totalTracks={allTracks.length}
          />

          <main className="mx-auto grid max-w-6xl gap-6 px-4 pb-32 pt-8 lg:grid-cols-[260px_1fr]">
            <aside className="flex flex-col gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Your library</p>
                <div className="mt-3 space-y-2">
                  {library.albums.map((album) => (
                    <button
                      key={album.id}
                      type="button"
                      onClick={() => handleSelectAlbum(album.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                        album.id === currentAlbumId
                          ? 'border-glow-500/60 bg-slate-50 text-slate-900 dark:bg-white/10 dark:text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/30'
                      }`}
                    >
                      <span className="font-medium">{album.title}</span>
                      <span className="text-xs text-slate-400 dark:text-white/50">{album.tracks.length}</span>
                    </button>
                  ))}
                </div>
              </div>
              <FilterBar
                genres={genres}
                artists={artists}
                genre={genre}
                artist={artist}
                onGenreChange={setGenre}
                onArtistChange={setArtist}
              />
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50">
                <p className="font-semibold text-slate-900 dark:text-white">Listening tips</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Use the search bar to find songs instantly.</li>
                  <li>Filters update the playlist in real time.</li>
                  <li>We remember your theme and volume settings.</li>
                </ul>
              </div>
            </aside>

            <section className="space-y-8">
              {status === 'error' ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                  Unable to load the library. Please check the data file in public/data/library.json.
                </div>
              ) : null}

              <Suspense
                fallback={
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50">
                    Loading albums...
                  </div>
                }
              >
                <AlbumGrid
                  albums={library.albums}
                  currentAlbumId={currentAlbumId}
                  onSelectAlbum={handleSelectAlbum}
                />
              </Suspense>

              <Suspense
                fallback={
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50">
                    Loading playlist...
                  </div>
                }
              >
                <TrackList
                  title={isFiltered ? 'Search results' : 'Current playlist'}
                  subtitle={
                    isFiltered
                      ? 'Showing tracks that match your filters.'
                      : `Playing from ${currentAlbum?.title || 'your library'}.`
                  }
                  tracks={displayedTracks}
                  currentTrackId={currentTrackId}
                  onSelectTrack={handleSelectTrack}
                />
              </Suspense>
            </section>
          </main>
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" />

      <Player
        track={currentTrack}
        album={currentAlbum}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
        onNext={handleNext}
        onPrev={handlePrev}
        progress={progress}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </div>
  )
}
