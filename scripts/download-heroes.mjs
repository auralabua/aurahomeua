/**
 * Runs as part of `npm run build` on Vercel.
 * Downloads hero images from Pexels CDN (no auth required).
 * Skips if files already exist.
 */
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/images');

// Pexels CDN — public, no API key needed, free to use
const PHOTOS = [
  {
    // Pexels #3822622 – woman stretching, bright living room, landscape
    url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1',
    filename: 'hero-desktop.jpg',
    desc: 'woman stretching living room desktop',
  },
  {
    // Pexels #6740753 – woman yoga mat portrait
    url: 'https://images.pexels.com/photos/6740753/pexels-photo-6740753.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&dpr=1',
    filename: 'hero-mobile.jpg',
    desc: 'woman yoga mat mobile portrait',
  },
];

async function download(url, dest, desc) {
  console.log(`↓ Downloading ${desc}…`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Vercel-build/1.0)',
      'Accept': 'image/jpeg,image/*',
      'Referer': 'https://www.pexels.com/',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  }

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('image')) {
    throw new Error(`Unexpected content-type: ${ct}`);
  }

  const readable = Readable.fromWeb(res.body);
  await pipeline(readable, createWriteStream(dest));

  const stat = (await import('fs')).statSync(dest);
  console.log(`  ✓ Saved ${dest} (${Math.round(stat.size / 1024)} KB)`);
}

(async () => {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  for (const { url, filename, desc } of PHOTOS) {
    const dest = path.join(OUT_DIR, filename);
    if (existsSync(dest)) {
      const stat = (await import('fs')).statSync(dest);
      console.log(`✓ ${filename} already exists (${Math.round(stat.size / 1024)} KB) — skipping`);
      continue;
    }

    try {
      await download(url, dest, desc);
    } catch (err) {
      console.error(`  ✗ Failed ${filename}: ${err.message}`);
      // Try backup photo IDs
      const backups = {
        'hero-desktop.jpg': [
          'https://images.pexels.com/photos/5485460/pexels-photo-5485460.jpeg?auto=compress&cs=tinysrgb&w=1920&dpr=1',
          'https://images.pexels.com/photos/3822629/pexels-photo-3822629.jpeg?auto=compress&cs=tinysrgb&w=1920&dpr=1',
        ],
        'hero-mobile.jpg': [
          'https://images.pexels.com/photos/6740047/pexels-photo-6740047.jpeg?auto=compress&cs=tinysrgb&w=1080&dpr=1',
          'https://images.pexels.com/photos/3822368/pexels-photo-3822368.jpeg?auto=compress&cs=tinysrgb&w=1080&dpr=1',
        ],
      };
      let saved = false;
      for (const backupUrl of (backups[filename] || [])) {
        try {
          await download(backupUrl, dest, `${desc} (backup)`);
          saved = true;
          break;
        } catch (e2) {
          console.error(`    backup failed: ${e2.message}`);
        }
      }
      if (!saved) console.warn(`  ⚠ Skipping ${filename} — will use fallback src`);
    }
  }
})();
