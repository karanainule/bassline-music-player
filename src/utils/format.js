export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function normalizeText(value) {
  return value.toLowerCase().trim()
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
