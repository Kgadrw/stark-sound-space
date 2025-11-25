"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const LatestVideos = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";

  // Sort videos by createdAt (newest first) and get the latest ones
  const latestVideos = useMemo(() => {
    const sorted = [...content.videos].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
    return sorted;
  }, [content.videos]);

  const currentVideo = latestVideos[currentVideoIndex];
  const thumbnailUrl = currentVideo ? getYouTubeThumbnailUrl(currentVideo.videoId) : null;

  const handlePrevious = () => {
    if (latestVideos.length > 0) {
      setCurrentVideoIndex((prev) => (prev === 0 ? latestVideos.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (latestVideos.length > 0) {
      setCurrentVideoIndex((prev) => (prev === latestVideos.length - 1 ? 0 : prev + 1));
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-0 lg:min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12" style={{ background: backgroundStyle }}>
        <div className="relative z-10 w-full max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-12 w-32 bg-white/10" />
            <Skeleton className="h-10 w-24 bg-white/10" />
          </div>
          <Skeleton className="aspect-video w-full rounded-lg bg-white/10" />
          <Skeleton className="h-6 w-64 mx-auto bg-white/10" />
        </div>
      </section>
    );
  }

  if (latestVideos.length === 0) {
    return null;
  }

  return (
    <section className="min-h-0 lg:min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-2 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12" style={{ background: backgroundStyle }}>
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header with VIDEOS and VIEW ALL */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* White horizontal line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-white" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-6 gap-3 sm:gap-0">
            {/* VIDEOS Label */}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider"
              style={{ fontFamily: 'sans-serif' }}
            >
              VIDEOS
            </motion.h1>

            {/* VIEW ALL Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a
                href="/videos"
                className="bg-transparent text-white border border-white hover:bg-white/10 rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium transition-all duration-200 inline-block touch-manipulation min-h-[44px] flex items-center justify-center"
              >
                VIEW ALL
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Video Player Section */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4 lg:gap-8">
          {/* Left Navigation Arrow */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={handlePrevious}
            className="text-white p-2 sm:p-3 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
            aria-label="Previous video"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
          </motion.button>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-[95vw] sm:max-w-4xl aspect-video rounded-lg overflow-hidden group cursor-pointer touch-manipulation"
            onClick={() => navigate(`/video/${encodeURIComponent(currentVideo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVideo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/60">
                    <Play className="h-16 w-16 text-white/30" />
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-full p-3 sm:p-4 md:p-6 shadow-lg touch-manipulation"
                  >
                    <Play className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-black fill-black" />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Navigation Arrow */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={handleNext}
            className="text-white p-2 sm:p-3 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
            aria-label="Next video"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
          </motion.button>
        </div>

        {/* Video Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-white font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-wide" style={{ fontFamily: 'sans-serif' }}>
            {currentVideo.title}
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestVideos;
