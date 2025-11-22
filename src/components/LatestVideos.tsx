import { motion } from "framer-motion";
import { Play, Youtube } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const LatestVideos = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";

  // Sort videos by createdAt (newest first) and get the latest 2
  const latestVideos = useMemo(() => {
    const sorted = [...content.videos].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
    return sorted.slice(0, 2); // Get the latest 2 videos (or all if less than 2)
  }, [content.videos]);

  if (isLoading) {
    return (
      <section className="relative bg-black pt-0 pb-24 px-4 sm:px-6 overflow-hidden" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Skeleton className="h-8 md:h-10 lg:h-12 w-64 md:w-80 mb-6 md:mb-8 bg-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {[1, 2].map((i) => (
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

  if (latestVideos.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-black pt-12 pb-24 px-4 sm:px-6 overflow-hidden" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs md:text-sm lg:text-sm font-extrabold uppercase tracking-wide mb-6 md:mb-8 section-title text-white"
          >
            Latest Videos from Nel Ngabo
          </motion.h2>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {latestVideos.map((video, index) => {
            const thumbnailUrl = getYouTubeThumbnailUrl(video.videoId);
            
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                        <Youtube className="h-20 w-20 text-white/30" />
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

        {/* View All Videos Button */}
        {content.videos.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <motion.a
              href="https://www.youtube.com/@nelngabo9740"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 border border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 transition uppercase tracking-[0.2em] text-sm cursor-pointer"
            >
              View All Videos
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestVideos;

