import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useContent } from "@/context/ContentContext";
import { ExternalLink } from "lucide-react";

const Spotify = () => {
  const { content } = useContent();
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";

  // Try to get Spotify URL from streaming platforms
  const spotifyPlatform = content.hero.streamingPlatforms?.find(
    (platform) => platform.preset === "spotify" || platform.url?.includes("spotify.com")
  );
  const spotifyUrl = spotifyPlatform?.url || "https://open.spotify.com/artist/nelngabo";
  
  // Extract artist ID from URL or use default
  const extractSpotifyArtistId = (url: string): string => {
    const match = url.match(/artist\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return "nelngabo"; // fallback
  };
  
  const spotifyArtistId = extractSpotifyArtistId(spotifyUrl);
  const spotifyEmbedUrl = `https://open.spotify.com/embed/artist/${spotifyArtistId}?utm_source=generator&theme=0`;

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-black relative overflow-hidden pt-16" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        
        <div className="relative z-10 h-[calc(100vh-4rem)] flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-black/50 backdrop-blur-sm">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Spotify</h1>
              <p className="text-gray-400 text-sm mt-1">Nel Ngabo</p>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 relative overflow-hidden">
            <iframe
              src={spotifyEmbedUrl}
              className="w-full h-full border-0"
              title="Spotify - Nel Ngabo"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            {/* Fallback overlay */}
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center flex-col gap-4 p-6 text-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-white text-lg mb-4">
                If the player doesn't load, click the link below.
              </p>
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white rounded-full font-semibold hover:bg-[#1DB954]/90 transition-colors pointer-events-auto"
              >
                Open Spotify in New Tab
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Spotify;

