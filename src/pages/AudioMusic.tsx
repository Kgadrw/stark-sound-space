import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Play, Plus } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  // Get Spotify link from streaming platforms
  const streamingPlatforms = content.hero.streamingPlatforms ?? [];
  const spotifyPlatform = streamingPlatforms.find((platform) => platform.preset === "spotify");
  const spotifyUrl = spotifyPlatform?.url || "https://open.spotify.com/artist/nelngabo";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden pt-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
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
                        
                        {/* Add to Playlist Button - Bottom Right */}
                        <div className="absolute bottom-3 right-3 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to playlist functionality can be implemented here
                            }}
                            className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-black/90 transition-all duration-200 touch-manipulation group"
                            aria-label="Add to playlist"
                          >
                            <Plus className="h-5 w-5 text-white transition-all duration-200 group-hover:scale-125" style={{ strokeWidth: 3 }} />
                          </button>
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

            </>
          )}
          
          {/* Listen More Link - Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors text-sm md:text-base"
            >
              Listen More
            </a>
          </motion.div>
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-2xl max-w-xs sm:max-w-sm md:max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-white/10 flex flex-col">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedAudio(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-white" />
                </button>

                {/* Audio Image */}
                <div className="relative w-full aspect-square flex-shrink-0">
                  <img
                    src={selectedAudioData.image}
                    alt={selectedAudioData.title || "Audio"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                {/* Audio Info */}
                <div className="p-4 sm:p-6 md:p-8 space-y-4 bg-gradient-to-b from-transparent to-black flex-shrink-0">
                  {selectedAudioData.title && (
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 break-words">
                        {selectedAudioData.title}
                      </h2>
                      <p className="text-gray-400 text-sm sm:text-base">Nel Ngabo</p>
                    </div>
                  )}

                  {/* Audio Link */}
                  {selectedAudioData.link && (
                    <div className="pt-2">
                      <Button
                        asChild
                        className="bg-white hover:bg-white/90 text-black font-bold rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base w-full transition-all duration-200 hover:scale-105"
                      >
                        <a
                          href={selectedAudioData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Play className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
                          <span>Listen Now</span>
                          <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
      <Footer />
    </>
  );
};

export default AudioMusic;

