"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MusicSection = () => {
  const { content, isLoading } = useContent();
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  
  // Sort albums by createdAt (newest first)
  const albums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const selectedAlbumData = albums.find((album) => album.id === selectedAlbum);

  if (isLoading) {
    return (
      <section id="music" className="min-h-screen bg-black relative overflow-hidden pt-24 pb-0 px-6">
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

  if (!albums.length) {
    return (
      <section id="music" className="min-h-screen bg-black relative overflow-hidden pt-24 pb-0 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg uppercase tracking-[0.2em]"
          >
            No albums published yet. Visit the admin dashboard to add albums, artwork, and tracklists for your fans.
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="music" className="min-h-screen bg-black relative overflow-hidden pt-24 pb-0 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Album Cover Horizontal Scroll */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 md:gap-8 pb-4">
              {albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer flex-shrink-0"
                  onClick={() => setSelectedAlbum(album.id)}
                >
                  <div className="relative w-48 md:w-56 lg:w-64 aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-300 group-hover:border-white/30 group-hover:scale-105">
                    <img
                      src={album.image}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium truncate">{album.title}</p>
                      {album.year && (
                        <p className="text-white/70 text-xs">{album.year}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Audio Links */}
      <AnimatePresence>
        {selectedAlbumData && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlbum(null)}
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
              <div className="relative bg-black border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-white" />
                </button>

                {/* Album Cover */}
                <div className="relative aspect-square w-full max-w-md mx-auto">
                  <img
                    src={selectedAlbumData.image}
                    alt={selectedAlbumData.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>

                {/* Album Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-2">
                      {selectedAlbumData.title}
                    </h2>
                    {selectedAlbumData.year && (
                      <p className="text-white/60 text-sm uppercase tracking-wider">{selectedAlbumData.year}</p>
                    )}
                  </div>

                  {selectedAlbumData.summary && (
                    <p className="text-white/70 text-sm leading-relaxed">{selectedAlbumData.summary}</p>
                  )}

                  {/* Audio Links */}
                  {selectedAlbumData.links && selectedAlbumData.links.length > 0 && (
                    <div className="pt-4 space-y-3">
                      <h3 className="text-white/90 text-sm font-semibold uppercase tracking-wider">Stream Now</h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedAlbumData.links.map((link) => (
                          <Button
                            key={link.id}
                            asChild
                            variant="outline"
                            className="border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-red-600/20 hover:border-red-500 hover:text-red-400 transition group"
                          >
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 group-hover:text-red-400 transition"
                            >
                              <span className="text-sm">{link.label || "Stream Now"}</span>
                              <ExternalLink className="h-3.5 w-3.5 text-white/60 group-hover:text-red-400 transition" />
                            </a>
                          </Button>
                        ))}
                      </div>
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

export default MusicSection;
