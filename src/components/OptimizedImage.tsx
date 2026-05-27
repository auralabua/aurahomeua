/**
 * OptimizedImage — routes images through Vercel's Image Optimization API.
 *
 * Vercel automatically serves AVIF (Chrome/Firefox) or WebP (Safari/Edge)
 * based on the browser's Accept header. Falls back to the original URL when
 * running locally (Vite dev server) or when the src is a data-URI / blob.
 *
 * Usage:
 *   <OptimizedImage src={product.images[0]} alt={product.name} sizes="(max-width:640px) 50vw, 25vw" />
 */

const IS_VERCEL = typeof window !== "undefined" && !window.location.hostname.includes("localhost");

/** Widths we generate srcset entries for */
const SRCSET_WIDTHS = [320, 480, 640, 960, 1200] as const;

/** Build a single Vercel optimized URL */
export const vercelImg = (src: string, width: number, quality = 80): string => {
  if (!IS_VERCEL || !src || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
};

/** Build a full srcset string */
const buildSrcSet = (src: string, quality: number): string =>
  SRCSET_WIDTHS.map(w => `${vercelImg(src, w, quality)} ${w}w`).join(", ");

export interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  src: string;
  alt: string;
  /**
   * CSS sizes attribute — tells browser how wide the image will be displayed.
   * Examples:
   *   "100vw"                              — full-width
   *   "(max-width: 640px) 50vw, 25vw"      — half on mobile, quarter on desktop
   *   "(max-width: 640px) 100vw, 640px"    — full mobile, fixed desktop
   */
  sizes?: string;
  /** JPEG quality 1-100 (default 80). Lower = smaller file. */
  quality?: number;
  /** Fallback src if the image fails to load */
  fallbackSrc?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  sizes = "100vw",
  quality = 80,
  loading = "lazy",
  decoding = "async",
  fallbackSrc,
  onError,
  ...props
}: OptimizedImageProps) => {
  if (!src) {
    return fallbackSrc ? (
      <img src={fallbackSrc} alt={alt} loading={loading} decoding={decoding} {...props} />
    ) : null;
  }

  // Don't optimize local dev / data URIs / blobs
  if (!IS_VERCEL || src.startsWith("data:") || src.startsWith("blob:")) {
    return (
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        onError={onError}
        {...props}
      />
    );
  }

  const defaultSrc = vercelImg(src, 800, quality);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    // Fallback to original URL if Vercel optimization fails
    const target = e.currentTarget;
    if (target.src !== src) {
      target.srcset = "";
      target.src = fallbackSrc ?? src;
    }
    onError?.(e);
  };

  return (
    <img
      src={defaultSrc}
      srcSet={buildSrcSet(src, quality)}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      {...props}
    />
  );
};
