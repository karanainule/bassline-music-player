# Bassline Music Player

Bassline is a modern music player web app with playlists, search, filters, and a polished listening experience. This rebuild uses React, Vite, and Tailwind CSS for a production-ready setup.

## Features
- Responsive layout with dark and light themes
- Album grid and playlist browser
- Search and filter by genre or artist
- Persistent preferences (theme, volume, last selection)
- Smooth motion transitions

## Tech Stack
- React + Vite
- Tailwind CSS
- Framer Motion

## Project Structure
- public/            Static assets (songs, covers, logo)
- public/data/       Mock API data (library.json)
- scripts/           Local utilities
- src/               React app
- legacy/            Previous HTML/CSS/JS implementation (kept for reference)

## Local Development
1. npm install
2. npm run dev

## Build
- npm run build
- npm run preview

## Adding Songs
1. Drop new MP3 files into public/songs/<album-name>/
2. Update public/songs/<album-name>/info.json
3. Run npm run generate:library

## Deployment
### Vercel
- Build Command: npm run build
- Output Directory: dist

### Render
- Build Command: npm install && npm run build
- Start Command: npm run start

An example config is included in render.yaml.
