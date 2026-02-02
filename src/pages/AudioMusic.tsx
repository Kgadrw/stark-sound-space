import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

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

  // Generate structured data for audio tracks
  const audioStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nel Ngabo Audio Tracks",
    "description": "Latest audio tracks and singles by Nel Ngabo",
    "itemListElement": audios.map((audio, index) => ({
      "@type": "MusicRecording",
      "position": index + 1,
      "name": audio.title,
      "description": audio.description || `${audio.title} by Nel Ngabo`,
      "image": audio.image,
      "byArtist": {
        "@type": "MusicGroup",
        "name": "Nel Ngabo"
      }
    }))
  };

  return (
    <>
      <SEO
        title="Latest Music & Audio Tracks"
        description={`Listen to Nel Ngabo's latest audio tracks and singles. ${audios.length > 0 ? `Featuring ${audios[0].title} and more.` : ''} Stream on Spotify, Apple Music, and other platforms.`}
        image={audios.length > 0 ? audios[0].image : "https://nelngabo.com/hero.jpeg"}
        keywords="Nel Ngabo music, Nel Ngabo audio, Nel Ngabo tracks, Nel Ngabo singles, Rwandan music, African music, Nel Ngabo latest songs"
        structuredData={audioStructuredData}
      />
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
              {/* Audio Grid - Modal Style Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {audios.map((audio, index) => (
                  <motion.div
                    key={audio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group h-full"
                  >
                    {/* Card with Modal Style */}
                    <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-xl border border-white/10 flex flex-col overflow-hidden hover:border-white/20 transition-all duration-300 h-full">
                      {/* Audio Image */}
                      <div className="relative w-full aspect-square flex-shrink-0">
                        <img
                          src={audio.image}
                          alt={audio.title || "Audio"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      </div>

                      {/* Audio Info */}
                      <div className="p-3 md:p-4 space-y-2 bg-gradient-to-b from-transparent to-black flex flex-col flex-grow min-h-[120px] md:min-h-[140px]">
                        <div className="flex-grow">
                          {audio.title && (
                            <div>
                              <h2 className="text-sm md:text-base font-bold text-white mb-0.5 break-words line-clamp-2">
                                {audio.title}
                              </h2>
                              <p className="text-gray-400 text-xs md:text-sm">Nel Ngabo</p>
                            </div>
                          )}
                        </div>

                        {/* Audio Link */}
                        <div className="pt-1 mt-auto">
                          {audio.link ? (
                            <motion.div
                              whileHover="hover"
                              initial="initial"
                              className="relative overflow-hidden rounded-full"
                            >
                              <Button
                                asChild
                                className="bg-white hover:bg-green-500 text-black hover:text-white font-bold rounded-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm w-full transition-colors duration-200"
                              >
                                <a
                                  href={audio.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 relative h-full"
                                >
                                  <motion.div
                                    variants={{
                                      initial: { y: 0, opacity: 1 },
                                      hover: { y: "100%", opacity: 0 }
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex items-center justify-center gap-1.5 text-black"
                                  >
                                    <Play className="h-3 w-3 md:h-3.5 md:w-3.5" fill="currentColor" />
                                    <span>Listen Now</span>
                                    <ExternalLink className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                  </motion.div>
                                  <motion.div
                                    variants={{
                                      initial: { y: "-100%", opacity: 0 },
                                      hover: { y: 0, opacity: 1 }
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="flex items-center justify-center gap-1.5 text-white"
                                  >
                                    <Play className="h-3 w-3 md:h-3.5 md:w-3.5" fill="currentColor" />
                                    <span>Listen Now</span>
                                    <ExternalLink className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                  </motion.div>
                                </a>
                              </Button>
                            </motion.div>
                          ) : (
                            <div className="h-[36px] md:h-[40px]"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Listen More Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: audios.length * 0.05 }}
                  className="group h-full"
                >
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-xl border border-white/10 flex flex-col overflow-hidden hover:border-white/20 transition-all duration-300 h-full">
                      {/* Empty Image Area */}
                      <div className="relative w-full aspect-square flex-shrink-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                        <div className="text-white/30 text-4xl md:text-5xl font-bold">+</div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      </div>

                      {/* Info Section */}
                      <div className="p-3 md:p-4 space-y-2 bg-gradient-to-b from-transparent to-black flex flex-col flex-grow min-h-[120px] md:min-h-[140px]">
                        <div className="flex-grow flex items-center justify-center">
                          <div className="text-center">
                            <h2 className="text-sm md:text-base font-bold text-white mb-0.5">
                              Listen More
                            </h2>
                            <p className="text-gray-400 text-xs md:text-sm">Explore More</p>
                          </div>
                        </div>

                        {/* Button Placeholder */}
                        <div className="pt-1 mt-auto">
                          <div className="h-[36px] md:h-[40px]"></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              </div>

            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AudioMusic;

