export async function getLibrary() {
  const response = await fetch('/data/library.json')
  if (!response.ok) {
    throw new Error('Failed to load library')
  }
  return response.json()
}
