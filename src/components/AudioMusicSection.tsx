"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const AudioMusicSection = () => {
  const { content, isLoading } = useContent();
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";
  
  // Sort audios by createdAt (newest first)
  const audios = [...content.audios].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const currentAudio = audios[currentAudioIndex];

  const handlePrevious = () => {
    if (audios.length > 0) {
      setCurrentAudioIndex((prev) => (prev === 0 ? audios.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (audios.length > 0) {
      setCurrentAudioIndex((prev) => (prev === audios.length - 1 ? 0 : prev + 1));
    }
  };

  if (isLoading) {
    return (
      <section id="audio-music" className="min-h-0 lg:min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12" style={{ background: backgroundStyle }}>
        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32 bg-white/10" />
            <Skeleton className="h-16 w-64 bg-white/10" />
            <Skeleton className="h-6 w-48 bg-white/10" />
            <Skeleton className="h-12 w-24 bg-white/10" />
          </div>
          <Skeleton className="aspect-square w-full rounded-lg bg-white/10" />
        </div>
      </section>
    );
  }

  if (!audios.length) {
    return null;
  }

  // Split title into main title and subtitle if it contains parentheses
  const titleParts = currentAudio.title.split(/(\([^)]+\))/);
  const mainTitle = titleParts[0].trim();
  const subtitle = titleParts[1]?.replace(/[()]/g, '') || '';

  return (
    <section id="audio-music" className="min-h-0 lg:min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12" style={{ background: backgroundStyle }}>
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full space-y-4 sm:space-y-6 lg:space-y-12 order-2 lg:order-1"
          >
            {/* MUSIC Label */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white font-bold text-xl sm:text-2xl lg:text-4xl uppercase tracking-wider"
              style={{ fontFamily: 'sans-serif' }}
            >
              MUSIC
            </motion.h1>

            {/* Song Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-1 sm:space-y-2 px-4 sm:px-6 lg:px-8"
            >
              <h2 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl uppercase tracking-tight leading-tight" style={{ fontFamily: 'sans-serif' }}>
                {mainTitle || currentAudio.title || 'Untitled'}
              </h2>
              {subtitle && (
                <h3 className="text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl uppercase tracking-tight leading-tight" style={{ fontFamily: 'sans-serif' }}>
                  ({subtitle})
                </h3>
              )}
            </motion.div>

            {/* Listen Now Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6"
            >
              {currentAudio.link ? (
                <Button
                  asChild
                  className="bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200 touch-manipulation min-h-[44px] flex items-center gap-2 w-full sm:w-auto"
                >
                  <a
                    href={currentAudio.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                    <span>Listen Now</span>
                  </a>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (currentAudio.link) {
                      window.open(currentAudio.link, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="bg-white text-black hover:bg-white/90 rounded-full px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200 touch-manipulation min-h-[44px] flex items-center gap-2 w-full sm:w-auto"
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  <span>Listen Now</span>
                </Button>
              )}
            </motion.div>

            {/* Navigation Arrows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <button
                onClick={handlePrevious}
                className="text-white p-3 sm:p-4 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous audio"
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
              <button
                onClick={handleNext}
                className="text-white p-3 sm:p-4 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next audio"
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side - Audio Cover */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto order-1 lg:order-2"
          >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAudio.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full bg-white rounded-lg overflow-hidden cursor-pointer group touch-manipulation"
              onClick={() => {
                if (currentAudio.link) {
                  window.open(currentAudio.link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <img
                src={currentAudio.image}
                alt={currentAudio.title || "Audio"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AudioMusicSection;
