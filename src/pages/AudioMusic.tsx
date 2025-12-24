import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AudioMusic = () => {
  const { content, isLoading } = useContent();
  
  // Sort audios by createdAt (newest first)
  const audios = [...content.audios].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                {audios.map((audio, index) => (
                  <motion.div
                    key={audio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      if (audio.link) {
                        window.open(audio.link, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <div className="relative mb-3">
                      {/* Record Player Platter - Behind */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[110%] h-[110%] rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl flex items-center justify-center relative">
                          {/* Concentric rings for platter effect */}
                          <div className="absolute w-[20%] h-[20%] rounded-full border border-gray-700/40"></div>
                          <div className="absolute w-[35%] h-[35%] rounded-full border border-gray-700/30"></div>
                          <div className="absolute w-[50%] h-[50%] rounded-full border border-gray-700/25"></div>
                          <div className="absolute w-[65%] h-[65%] rounded-full border border-gray-700/20"></div>
                          <div className="absolute w-[80%] h-[80%] rounded-full border border-gray-700/15"></div>
                          <div className="absolute w-[95%] h-[95%] rounded-full border border-gray-700/10"></div>
                          {/* Center spindle */}
                          <div className="absolute w-[8%] h-[8%] rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-inner border border-gray-500/50"></div>
                        </div>
                      </div>
                      
                      {/* Album Cover */}
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-2xl transition-all duration-300 z-10">
                        <img
                          src={audio.image}
                          alt={audio.title || "Audio"}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Play Button - Bottom Right */}
                        <div className="absolute bottom-3 right-3 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (audio.link) {
                                window.open(audio.link, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-black/90 transition-all duration-200 touch-manipulation group opacity-0 group-hover:opacity-100"
                            aria-label="Play"
                          >
                            <Play className="h-5 w-5 text-white transition-all duration-200 group-hover:scale-125" fill="currentColor" style={{ strokeWidth: 3 }} />
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

      <Footer />
    </>
  );
};

export default AudioMusic;

