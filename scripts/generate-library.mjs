import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(process.cwd(), 'public', 'songs')
const outputDir = path.resolve(process.cwd(), 'public', 'data')
const outputFile = path.join(outputDir, 'library.json')

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const folders = await fs.readdir(root, { withFileTypes: true })
const albums = []

for (const dirent of folders) {
  if (!dirent.isDirectory()) continue
  const folder = dirent.name
  const albumPath = path.join(root, folder)
  const infoPath = path.join(albumPath, 'info.json')
  const info = JSON.parse(await fs.readFile(infoPath, 'utf8'))
  const files = await fs.readdir(albumPath)
  const tracks = files
    .filter((file) => file.toLowerCase().endsWith('.mp3'))
    .map((file) => {
      const title = path.parse(file).name
      return {
        id: slugify(title),
        title,
        artist: info.title,
        src: `/songs/${folder}/${file}`,
      }
    })

  const genre = `${folder[0].toUpperCase()}${folder.slice(1)}`
  albums.push({
    id: folder,
    title: info.title,
    description: info.description,
    artist: 'Various Artists',
    genre,
    cover: `/songs/${folder}/cover.jpg`,
    tracks,
  })
}

await fs.mkdir(outputDir, { recursive: true })
await fs.writeFile(outputFile, JSON.stringify({ albums }, null, 2))

console.log(`Library generated at ${outputFile}`)
