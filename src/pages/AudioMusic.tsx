import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Play } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";

const AudioMusic = () => {
  const { content, isLoading } = useContent();
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  
  // Sort audios by createdAt (newest first)
  const audios = [...content.audios].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const selectedAudioData = audios.find((audio) => audio.id === selectedAudio);
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-24 px-4 sm:px-6 lg:px-8" style={{ background: backgroundStyle }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
              Music
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              All releases from Nel Ngabo
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-square rounded-lg bg-white/10" />
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </div>
              ))}
            </div>
          ) : audios.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/60 text-lg">No audio music available yet.</p>
            </div>
          ) : (
            <>
              {/* Audio Grid - Spotify/Audiomack Style */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {audios.map((audio, index) => (
                  <motion.div
                    key={audio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedAudio(audio.id)}
                  >
                    <div className="relative mb-3">
                      {/* Album Cover */}
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                        <img
                          src={audio.image}
                          alt={audio.title || "Audio"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg"
                          >
                            <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Title and Info */}
                    <div className="space-y-1">
                      <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-white transition-colors">
                        {audio.title || "Untitled"}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm line-clamp-1">
                        Nel Ngabo
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Listen More Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 flex justify-center"
              >
                <Button
                  asChild
                  className="bg-white hover:bg-white/90 text-black font-bold rounded-full px-8 py-6 text-base transition-all duration-200 hover:scale-105"
                >
                  <a
                    href="https://open.spotify.com/artist/nelngabo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Play className="h-5 w-5" fill="currentColor" />
                    <span>Listen More</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>

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
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/10">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedAudio(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-white" />
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
                <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-black">
                  {selectedAudioData.title && (
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {selectedAudioData.title}
                      </h2>
                      <p className="text-gray-400 text-sm">Nel Ngabo</p>
                    </div>
                  )}

                  {/* Audio Link */}
                  {selectedAudioData.link && (
                    <div className="pt-2">
                      <Button
                        asChild
                        className="bg-white hover:bg-white/90 text-black font-bold rounded-full px-8 py-6 text-base w-full transition-all duration-200 hover:scale-105"
                      >
                        <a
                          href={selectedAudioData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Play className="h-5 w-5" fill="currentColor" />
                          <span>Listen Now</span>
                          <ExternalLink className="h-4 w-4" />
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

export default AudioMusic;

