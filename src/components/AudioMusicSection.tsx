"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Play } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AudioMusicSection = () => {
  const { content, isLoading } = useContent();
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
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

  const selectedAudioData = audios.find((audio) => audio.id === selectedAudio);

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
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 md:gap-8 pb-4">
              {audios.map((audio, index) => (
                <motion.div
                  key={audio.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer flex-shrink-0"
                  onClick={() => setSelectedAudio(audio.id)}
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

      {/* Modal for Audio Link - Spotify Style */}
      <AnimatePresence>
        {selectedAudioData && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAudio(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-xl sm:rounded-2xl max-w-[280px] sm:max-w-xs w-full max-h-[65vh] sm:max-h-[70vh] overflow-hidden shadow-2xl border border-white/10">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedAudio(null)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1 sm:p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
                  aria-label="Close"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </button>

                {/* Audio Image */}
                <div className="relative w-full aspect-square">
                  <img
                    src={selectedAudioData.image}
                    alt={selectedAudioData.title || "Audio"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                {/* Audio Info */}
                <div className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 bg-gradient-to-b from-transparent to-black">
                  {selectedAudioData.title && (
                    <div>
                      <h2 className="text-sm sm:text-base md:text-lg font-bold text-white mb-0.5 line-clamp-2">
                        {selectedAudioData.title}
                      </h2>
                      <p className="text-gray-400 text-[10px] sm:text-xs">Nel Ngabo</p>
                    </div>
                  )}

                  {/* Audio Link */}
                  {selectedAudioData.link && (
                    <div className="pt-0.5 sm:pt-1">
                      <Button
                        asChild
                        className="bg-white hover:bg-white/90 text-black font-bold rounded-full px-3 py-2 sm:px-4 sm:py-3 text-[10px] sm:text-xs w-full transition-all duration-200 hover:scale-105"
                      >
                        <a
                          href={selectedAudioData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 sm:gap-1.5"
                        >
                          <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="currentColor" />
                          <span>Listen Now</span>
                          <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AudioMusicSection;

