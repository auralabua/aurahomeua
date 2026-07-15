import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { photoId, size = '1920' } = req.query as Record<string, string>;
  if (!photoId) return res.status(400).json({ error: 'photoId required' });

  try {
    const photoPageUrl = `https://unsplash.com/photos/${photoId}`;
    const oembedUrl = `https://oembed.unsplash.com/?url=${encodeURIComponent(photoPageUrl)}&format=json`;

    const r = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Vercel/1.0)' },
    });
    if (!r.ok) return res.status(502).json({ error: `oembed status ${r.status}` });

    const data = await r.json() as {
      thumbnail_url?: string;
      title?: string;
      author_name?: string;
      width?: number;
      height?: number;
    };

    const thumb: string = data.thumbnail_url ?? '';
    // Replace width to get full-res, remove height & quality constraints
    const fullRes = thumb
      .replace(/([?&])w=\d+/, `$1w=${size}`)
      .replace(/&h=\d+/, '')
      .replace(/&q=\d+/, '&q=85');

    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.json({
      photoId,
      title: data.title,
      author: data.author_name,
      thumbUrl: thumb,
      fullResUrl: fullRes,
      originalWidth: data.width,
      originalHeight: data.height,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
