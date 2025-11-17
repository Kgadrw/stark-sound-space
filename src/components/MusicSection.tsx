"use client";

import { motion } from "framer-motion";
import { Music2, ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";


const MusicSection = () => {
  const orbitronStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    .orbitron {
      font-family: "Orbitron", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
    }
  `;

  const { content } = useContent();
  // Sort albums by createdAt (newest first)
  const albums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  if (!albums.length) {
    return (
      <section id="music" className="min-h-screen bg-black relative overflow-hidden py-24 px-6">
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
      <style>{orbitronStyle}</style>
      <section id="music" className="min-h-screen bg-black relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-24">
          {albums.map((album, index) => {
            const isEven = index % 2 === 1; // Second album (index 1), fourth (index 3), etc.
            
            return (
              <motion.div
                key={album.id}
                id={`album-card-${album.id}`}
                data-search-item="music"
                data-search-label={`Album · ${album.title}`}
                data-search-category="Album"
                data-search-description={`${album.year} · ${(album.tracks ?? []).length} tracks`}
                data-search-keywords={[album.title, album.year, ...(album.tracks ?? [])].join("|")}
                data-search-target="music"
                data-search-target-element={`album-card-${album.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  isEven ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Album Image */}
                <motion.div
                  className={`relative overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl aspect-square group ${
                    isEven ? "lg:col-start-2" : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
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
                  className={`space-y-6 ${isEven ? "lg:col-start-1 lg:row-start-1" : ""}`}
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                >
                  {/* Album Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-[0.1em] orbitron">
                    {album.title}
                  </h2>

                  {/* Year */}
                  {album.year && (
                    <p className="text-xs tracking-[0.4em] text-white/50 uppercase">{album.year}</p>
                  )}

                  {/* Description */}
                  {album.description && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">About This Album</p>
                      <p className="text-base text-white/70 leading-relaxed whitespace-pre-line elms-sans">{album.description}</p>
                    </div>
                  )}

                  {/* Summary */}
                  {album.summary && !album.description && (
                    <p className="text-base text-white/70 leading-relaxed elms-sans">{album.summary}</p>
                  )}

                  {/* Tracklist */}
                  {album.tracks && album.tracks.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">Tracklist</p>
                      <ul className="space-y-3">
                        {album.tracks.map((track, trackIndex) => (
                          <motion.li
                            key={`${track}-${trackIndex}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: trackIndex * 0.05 }}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm px-3 py-2 hover:border-white/20 transition"
                          >
                            <span className="flex items-center gap-3 text-sm text-white/90">
                              <span className="text-xs text-white/50 w-6">{String(trackIndex + 1).padStart(2, "0")}</span>
                              {track}
                            </span>
                            <Music2 className="h-4 w-4 text-pink-400" />
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Streaming Platform Links */}
                  {album.links && album.links.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">Streaming Platforms</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {album.links.map((link, linkIndex) => (
                          <motion.div
                            key={link.id || linkIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: linkIndex * 0.05 }}
                          >
                            <Button
                              asChild
                              variant="outline"
                              className="border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:border-white/40 transition group"
                            >
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <span className="elms-sans">{link.label || "Stream Now"}</span>
                                <ExternalLink className="h-3.5 w-3.5 text-white/60 group-hover:text-white transition" />
                              </a>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default MusicSection;
