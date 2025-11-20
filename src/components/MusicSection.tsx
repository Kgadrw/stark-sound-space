"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const MusicSection = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";
  
  const orbitronStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    .orbitron {
      font-family: "Orbitron", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
    }
  `;

  // Sort albums by createdAt (newest first)
  const albums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const selectedAlbumData = albums.find((album) => album.id === selectedAlbum);

  if (isLoading) {
    return (
      <>
        <style>{orbitronStyle}</style>
        <section id="music" className="min-h-screen bg-black relative overflow-hidden pt-24 pb-24 px-4 sm:px-6" style={{ background: backgroundStyle }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
          <div className="relative z-10 max-w-7xl mx-auto space-y-24">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <Skeleton className="aspect-square w-full rounded-lg bg-white/10" />
                <div className="space-y-6">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-10 w-64 bg-white/10" />
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="h-20 w-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  if (!albums.length) {
    return (
      <section id="music" className="min-h-screen bg-black relative overflow-hidden pt-24 pb-0 px-6" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
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
      <style>{orbitronStyle}</style>
      <section id="music" className="min-h-screen bg-black relative overflow-hidden pt-24 pb-24 px-4 sm:px-6" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-24">
          {albums.map((album, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  !isEven ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Album Image */}
                <motion.div
                  className={`relative overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl aspect-square group cursor-pointer ${
                    !isEven ? 'lg:col-start-2' : ''
                  }`}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/album/${album.id}`)}
                >
                  <img
                    src={album.image}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground to-transparent opacity-0 group-hover:opacity-10 transform translate-x-full group-hover:translate-x-[-100%] transition-all duration-1000" />
                </motion.div>

                {/* Album Info */}
                <motion.div
                  className={`space-y-6 ${
                    !isEven ? 'lg:col-start-1 lg:row-start-1' : ''
                  }`}
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                >
                  {/* Album Title */}
                  <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-[0.1em] orbitron mb-4">
                      {album.title}
                    </h2>
                    
                    {/* Year */}
                    {album.year && (
                      <p className="text-sm tracking-[0.4em] text-white/50 uppercase elms-sans">{album.year}</p>
                    )}
                  </div>

                  {/* Summary */}
                  {album.summary && (
                    <p className="text-base md:text-lg text-white/70 leading-relaxed elms-sans">
                      {album.summary}
                    </p>
                  )}

                  {/* Streaming Platform Links */}
                  {album.links && album.links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {album.links.map((link, linkIndex) => (
                        <motion.div
                          key={link.id || linkIndex}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.3 + linkIndex * 0.05 }}
                        >
                          <Button
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
                              <span className="elms-sans group-hover:text-red-400 transition">{link.label || "Stream Now"}</span>
                              <ExternalLink className="h-3.5 w-3.5 text-white/60 group-hover:text-red-400 transition" />
                            </a>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* View Album Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <Button
                      onClick={() => navigate(`/album/${album.id}`)}
                      variant="outline"
                      className="border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 transition"
                    >
                      View Album
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
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
