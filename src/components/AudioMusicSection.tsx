"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AudioMusicSection = () => {
  const { content, isLoading } = useContent();
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  
  // Sort audios by createdAt (newest first)
  const audios = [...content.audios].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const selectedAudioData = audios.find((audio) => audio.id === selectedAudio);

  if (isLoading) {
    return (
      <section id="audio-music" className="bg-black relative overflow-hidden pt-24 pb-0 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
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
      <section id="audio-music" className="bg-black relative overflow-hidden pt-24 pb-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white uppercase tracking-wide mb-6 md:mb-8"
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

      {/* Modal for Audio Link */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-black border border-white/20 rounded-lg max-w-md w-full max-h-[85vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedAudio(null)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-white" />
                </button>

                {/* Audio Image */}
                <div className="relative aspect-square w-full max-w-xs mx-auto">
                  <img
                    src={selectedAudioData.image}
                    alt={selectedAudioData.title || "Audio"}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>

                {/* Audio Info */}
                <div className="p-4 space-y-3">
                  {selectedAudioData.title && (
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide mb-2">
                        {selectedAudioData.title}
                      </h2>
                    </div>
                  )}

                  {/* Audio Link */}
                  {selectedAudioData.link && (
                    <div className="pt-2 space-y-2">
                      <h3 className="text-white/90 text-xs font-semibold uppercase tracking-wider">Listen Now</h3>
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-red-600/20 hover:border-red-500 hover:text-red-400 transition group w-full"
                      >
                        <a
                          href={selectedAudioData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 group-hover:text-red-400 transition"
                        >
                          <span className="text-sm">Listen Now</span>
                          <ExternalLink className="h-3.5 w-3.5 text-white/60 group-hover:text-red-400 transition" />
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

