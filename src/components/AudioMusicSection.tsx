"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";

const AudioMusicSection = () => {
  const { content, isLoading } = useContent();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // Auto-scroll animation to show users they can scroll
  useEffect(() => {
    if (isLoading || audios.length <= 1 || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // Only auto-scroll if content overflows
    if (scrollWidth <= clientWidth) return;

    // Wait a bit before starting the animation
    const startDelay = setTimeout(() => {
      // Scroll to the right smoothly
      const scrollAmount = Math.min(200, scrollWidth - clientWidth);
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });

      // After showing the scroll, scroll back to start
      setTimeout(() => {
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }, 2000);
    }, 1500);

    return () => clearTimeout(startDelay);
  }, [audios.length, isLoading]);

  if (isLoading) {
    return (
      <section id="audio-music" className="bg-black relative overflow-hidden pt-24 pb-0 px-6" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 md:gap-8 pb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="w-48 md:w-56 lg:w-64 aspect-square flex-shrink-0 rounded-lg bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!audios.length) {
    return null;
  }

  return (
    <>
      <section id="audio-music" className="bg-black relative overflow-hidden pt-24 pb-12 px-6" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs md:text-sm lg:text-sm font-extrabold uppercase tracking-wide mb-6 md:mb-8 section-title text-white"
          >
            More Music from Nel Ngabo
          </motion.h2>

          {/* Audio Image Horizontal Scroll */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-6 md:gap-8 pb-4">
              {audios.map((audio, index) => (
                <motion.div
                  key={audio.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer flex-shrink-0"
                  onClick={() => {
                    if (audio.link) {
                      window.open(audio.link, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <div className="relative w-48 md:w-56 lg:w-64 aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-300 group-hover:border-white/30 group-hover:scale-105">
                    <img
                      src={audio.image}
                      alt={audio.title || "Audio"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {audio.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-medium truncate">{audio.title}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AudioMusicSection;

