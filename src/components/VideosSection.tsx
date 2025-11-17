import { motion } from "framer-motion";
import { Play, Youtube } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import YouTubePlayer from "@/components/YouTubePlayer";
import { useState } from "react";

const VideosSection = () => {
  const { content } = useContent();
  const videos = content.videos;
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);

  const getYear = (video: typeof videos[0]) => {
    if (video.createdAt) {
      return new Date(video.createdAt).getFullYear().toString();
    }
    // Try to extract year from title or description
    const yearMatch = (video.title + " " + video.description).match(/\b(19|20)\d{2}\b/);
    return yearMatch ? yearMatch[0] : "";
  };

  if (!videos.length) {
    return (
      <section id="videos" className="min-h-screen bg-black relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-[0.3em] text-white uppercase">VIDEOS</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => {
            const thumbnailUrl = getYouTubeThumbnailUrl(video.videoId);
            const year = getYear(video);
            
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
                whileHover={{ y: -5 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedVideo({ id: video.videoId, title: video.title })}
              >
                {/* Thumbnail */}
                <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-500 group-hover:border-white/30">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/60">
                      <Youtube className="h-12 w-12 text-white/30" />
                    </div>
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="pointer-events-none absolute top-0 right-0 h-12 w-12 border-t-2 border-r-2 border-pink-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Title and Year */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-[0.1em] uppercase line-clamp-2 group-hover:text-pink-400 transition-colors">
                    {video.title}
                  </h3>
                  {year && (
                    <p className="text-xs text-white/50 uppercase tracking-[0.3em]">
                      {year}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {selectedVideo && (
          <YouTubePlayer
            videoId={selectedVideo.id}
            title={selectedVideo.title}
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </div>
    </section>
  );
};

export default VideosSection;
