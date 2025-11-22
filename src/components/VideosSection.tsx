import { motion, AnimatePresence } from "framer-motion";
import { Play, Youtube, Search, ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";

const VideosSection = () => {
  const { content, isLoading } = useContent();
  const videos = content.videos;
  const navigate = useNavigate();
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const query = searchQuery.toLowerCase();
    return videos.filter((video) => 
      video.title.toLowerCase().includes(query) ||
      (video.description && video.description.toLowerCase().includes(query)) ||
      (video.lyrics && video.lyrics.toLowerCase().includes(query))
    );
  }, [videos, searchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else {
      searchInputRef.current?.blur();
    }
  }, [isSearchOpen]);

  if (isLoading) {
    return (
      <section id="videos" className="min-h-screen bg-black relative overflow-hidden py-24 px-6" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12 flex items-center gap-2 sm:gap-3 justify-end">
            <Skeleton className="h-10 w-10 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg bg-white/10" />
                <Skeleton className="h-6 w-3/4 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!videos.length) {
    return (
      <section id="videos" className="min-h-screen bg-black relative overflow-hidden py-24 px-6" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-[0.3em] text-white uppercase"
          >
            VIDEOS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg uppercase tracking-[0.2em]"
          >
            No videos yet. Add video embeds from the admin dashboard.
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="min-h-screen bg-black relative overflow-hidden py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Search Bar and More Videos Button - Same design as Hero */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 md:mb-12 flex items-center gap-2 sm:gap-3 justify-end"
        >
          {/* More Videos Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              asChild
              className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold rounded-full px-6 py-3 text-sm transition-all duration-200 hover:scale-105"
            >
              <a
                href={(() => {
                  const youtubePlatform = content.hero.streamingPlatforms?.find((platform) => platform.preset === "youtube");
                  return youtubePlatform?.url || "https://www.youtube.com/@nelngabo9740";
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Youtube className="h-4 w-4" />
                <span>More Videos</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </motion.div>
          <motion.button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative z-10 flex h-10 w-10 items-center justify-center border border-white/40 bg-black/80 backdrop-blur-sm text-white shadow-lg transition hover:border-white hover:bg-black ${
              isSearchOpen ? "border-white bg-black" : ""
            }`}
            aria-label="Toggle search"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </motion.button>
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="relative z-10 flex items-center border border-white/20 bg-black/80 px-4 py-2 text-white backdrop-blur-xl shadow-lg"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search videos..."
                    className="relative z-10 w-36 sm:w-52 bg-transparent text-xs uppercase tracking-[0.3em] text-white placeholder:text-white/30 focus:outline-none"
                    onBlur={(event) => {
                      // delay closing to allow click on videos
                      setTimeout(() => {
                        const nextTarget = event.relatedTarget as HTMLElement | null;
                        if (!nextTarget?.closest(".group")) {
                          setIsSearchOpen(false);
                        }
                      }, 120);
                    }}
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          {searchQuery && isSearchOpen && (
            <p className="text-xs text-white/50 uppercase tracking-[0.2em]">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
            </p>
          )}
        </motion.div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {filteredVideos.map((video, index) => {
            const thumbnailUrl = getYouTubeThumbnailUrl(video.videoId);
            
            return (
              <motion.div
                key={video.id}
                id={`video-card-${video.id}`}
                data-search-item="video"
                data-search-label={`Video · ${video.title}`}
                data-search-category="Video"
                data-search-description={video.description || ""}
                data-search-keywords={video.title}
                data-search-target="videos"
                data-search-target-element={`video-card-${video.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col"
              >
                {/* Video Card Container with White Border */}
                <div className="rounded-lg border-2 border-white bg-black p-0 overflow-hidden">
                  {/* Thumbnail */}
                  <div 
                    className="relative aspect-video overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/video/${encodeURIComponent(video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
                  >
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/60">
                        <Youtube className="h-16 w-16 text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Video Title - Centered */}
                  <div className="px-4 py-4 text-center">
                    <h3 className="text-sm md:text-base font-medium text-white uppercase tracking-wide mb-4">
                      {video.title}
                    </h3>
                    
                    {/* WATCH NOW Button */}
                    <button
                      onClick={() => navigate(`/video/${encodeURIComponent(video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
                      className="w-full bg-white text-black uppercase font-semibold py-3 px-6 rounded-md hover:bg-[#FF0000] hover:text-white transition-colors duration-300 text-sm tracking-wide"
                    >
                      WATCH NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <p className="text-white/60 text-lg uppercase tracking-[0.2em] elms-sans">
              No videos found matching "{searchQuery}"
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default VideosSection;
