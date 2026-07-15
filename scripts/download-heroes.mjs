/**
 * Runs during `npm run build` on Vercel.
 * Downloads high-quality Unsplash hero images via oEmbed API → saves to public/images/.
 * Skips download if file already exists (CI cache-friendly).
 */
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/images');

const PHOTOS = [
  {
    id: 'NB_SZkaOumM',   // Karolina Grabowska – woman on yoga mat, living room
    filename: 'hero-desktop.jpg',
    width: 1920,
  },
  {
    id: 'NtANZNby_qs',  // Vitaly Gariev – woman yoga modern living room
    filename: 'hero-mobile.jpg',
    width: 1080,
  },
];

async function getImageUrl(photoId, width) {
  const pageUrl = `https://unsplash.com/photos/${photoId}`;
  const oembedUrl = `https://oembed.unsplash.com/?url=${encodeURIComponent(pageUrl)}&format=json`;

  const res = await fetch(oembedUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; build/1.0)' },
  });
  if (!res.ok) throw new Error(`oEmbed ${res.status} for ${photoId}`);

  const data = await res.json();
  const thumb = data.thumbnail_url ?? '';
  if (!thumb) throw new Error(`No thumbnail_url for ${photoId}`);

  // Bump to full width, remove height cap, set quality
  const full = thumb
    .replace(/([?&])w=\d+/, `$1w=${width}`)
    .replace(/&h=\d+/, '')
    .replace(/&q=\d+/, '&q=85')
    .replace(/&fm=\w+/, '&fm=jpg');

  return full;
}

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; build/1.0)' },
  });
  if (!res.ok) throw new Error(`Image fetch ${res.status}: ${url}`);
  if (!res.body) throw new Error('No response body');

  const { Readable } = await import('stream');
  const readable = Readable.fromWeb(res.body);
  await pipeline(readable, createWriteStream(dest));
}

(async () => {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  for (const { id, filename, width } of PHOTOS) {
    const dest = path.join(OUT_DIR, filename);
    if (existsSync(dest)) {
      console.log(`✓ ${filename} already exists — skipping`);
      continue;
    }

    try {
      console.log(`↓ Resolving ${id}…`);
      const imgUrl = await getImageUrl(id, width);
      console.log(`  URL: ${imgUrl.substring(0, 80)}…`);
      console.log(`  Downloading → ${filename}…`);
      await downloadImage(imgUrl, dest);
      console.log(`  ✓ Saved ${filename}`);
    } catch (err) {
      console.warn(`  ✗ Failed for ${id}: ${err.message} — skipping`);
    }
  }
})();
