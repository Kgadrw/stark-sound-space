import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Music = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  
  // Sort albums by createdAt (newest first)
  const albums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden pt-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col items-center text-center"
          >
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 eagle-lake">
                Albums
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                latest albums from nelngabo
              </p>
            </div>
          </motion.div>

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
          ) : albums.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/60 text-lg">No albums available yet.</p>
            </div>
          ) : (
            <>
              {/* Albums Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {albums.map((album, index) => {
                  // Split title into main title and subtitle if it contains parentheses
                  const titleParts = album.title.split(/(\([^)]+\))/);
                  const mainTitle = titleParts[0].trim();
                  const subtitle = titleParts[1]?.replace(/[()]/g, '') || '';

                  return (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/album/${encodeURIComponent(album.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
                    >
                      <div className="relative mb-3">
                        {/* Album Cover */}
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                          <img
                            src={album.image}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>

                      {/* Title and Info */}
                      <div className="space-y-1">
                        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-white transition-colors">
                          {mainTitle || album.title}
                        </h3>
                        {subtitle && (
                          <p className="text-white/80 text-xs md:text-sm line-clamp-1">
                            {subtitle}
                          </p>
                        )}
                        {album.year && (
                          <p className="text-gray-400 text-xs md:text-sm line-clamp-1">
                            {album.year}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Music;

