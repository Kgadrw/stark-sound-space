"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const VideosSection = () => {
  const { content, isLoading } = useContent();
  const videos = content.videos;
  const navigate = useNavigate();

  // Sort videos by createdAt (newest first)
  const sortedVideos = [...videos].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  if (isLoading) {
    return (
      <section id="videos" className="min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16">
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!videos.length) {
    return (
      <section id="videos" className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
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
    <section id="videos" className="min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {sortedVideos.map((video, index) => {
            const thumbnailUrl = getYouTubeThumbnailUrl(video.videoId);

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/video/${encodeURIComponent(video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-105">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/60">
                      <Play className="h-12 w-12 text-white/30" />
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white rounded-full p-3 sm:p-4 shadow-lg"
                    >
                      <Play className="h-6 w-6 sm:h-8 sm:w-8 text-black fill-black" />
                    </motion.div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-2">
                  <h3 className="text-white font-bold text-base sm:text-lg uppercase tracking-tight leading-tight line-clamp-2" style={{ fontFamily: 'sans-serif' }}>
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-white/70 text-sm line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
