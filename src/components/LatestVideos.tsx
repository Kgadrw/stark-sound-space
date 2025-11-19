import { motion } from "framer-motion";
import { Play, Youtube } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const LatestVideos = () => {
  const { content } = useContent();
  const navigate = useNavigate();

  // Sort videos by createdAt (newest first) and get the latest 2
  const latestVideos = useMemo(() => {
    const sorted = [...content.videos].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
    return sorted.slice(0, 2); // Get the latest 2 videos (or all if less than 2)
  }, [content.videos]);

  if (latestVideos.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-black py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-normal tracking-[0.1em] text-white uppercase">
              Videos
            </h2>
          </motion.div>

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
                className="group"
              >
                {/* Thumbnail */}
                <div 
                  className="relative aspect-video overflow-hidden rounded-lg border-2 border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-500 group-hover:border-white/30 cursor-pointer mb-6"
                  onClick={() => navigate(`/video/${video.id}`)}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/60">
                      <Youtube className="h-20 w-20 text-white/30" />
                    </div>
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-12 h-12 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 border-t-2 border-r-2 border-pink-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Video Title */}
                <div className="text-left">
                  <h3 className="text-base md:text-lg lg:text-xl font-light text-white uppercase tracking-wide elms-sans line-clamp-2">
                    {video.title}
                  </h3>
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
            <motion.button
              onClick={() => navigate("/videos")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 transition uppercase tracking-[0.2em] text-sm"
            >
              View All Videos
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestVideos;

