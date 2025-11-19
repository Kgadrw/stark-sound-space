/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it's already just an ID (11 characters, alphanumeric, hyphens, underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }

  return null;
}

/**
 * Generates YouTube embed URL from video ID or URL
 */
export function getYouTubeEmbedUrl(videoIdOrUrl: string | null | undefined): string | null {
  if (!videoIdOrUrl) return null;
  
  const videoId = extractYouTubeVideoId(videoIdOrUrl);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&start=0`;
}

/**
 * Generates YouTube thumbnail URL from video ID or URL (HD quality)
 */
export function getYouTubeThumbnailUrl(videoIdOrUrl: string | null | undefined): string | null {
  if (!videoIdOrUrl) return null;
  
  const videoId = extractYouTubeVideoId(videoIdOrUrl);
  if (!videoId) return null;

  // Use maxresdefault for HD quality (1280x720), falls back to hqdefault (480x360) if not available
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

