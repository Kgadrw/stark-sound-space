import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LatestAlbum = () => {
  const orbitronStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    .orbitron {
      font-family: "Orbitron", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
    }
  `;

  const { content } = useContent();
  const navigate = useNavigate();
  
  // Sort albums by createdAt (newest first) and get the latest one
  const sortedAlbums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const latestAlbum = sortedAlbums[0];

  if (!latestAlbum) {
    return null;
  }

  return (
    <>
      <style>{orbitronStyle}</style>
      <section className="relative bg-black py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Album Image */}
            <motion.div
              className="relative overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl aspect-square group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/album/${latestAlbum.id}`)}
            >
              <img
                src={latestAlbum.image}
                alt={latestAlbum.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground to-transparent opacity-0 group-hover:opacity-10 transform translate-x-full group-hover:translate-x-[-100%] transition-all duration-1000" />
            </motion.div>

            {/* Album Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Section Label */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-xs tracking-[0.4em] text-white/50 uppercase"
              >
                Latest Release
              </motion.p>

              {/* Album Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-[0.1em] orbitron">
                {latestAlbum.title}
              </h2>

              {/* Year */}
              {latestAlbum.year && (
                <p className="text-xs tracking-[0.4em] text-white/50 uppercase">{latestAlbum.year}</p>
              )}

              {/* Summary */}
              {latestAlbum.summary && (
                <p className="text-base text-white/70 leading-relaxed elms-sans">{latestAlbum.summary}</p>
              )}

              {/* Streaming Platform Links */}
              {latestAlbum.links && latestAlbum.links.length > 0 && (
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    {latestAlbum.links.map((link, linkIndex) => (
                      <motion.div
                        key={link.id || linkIndex}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + linkIndex * 0.05 }}
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
                </div>
              )}

              {/* View Album Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => navigate(`/album/${latestAlbum.id}`)}
                  variant="outline"
                  className="border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 transition"
                >
                  View Album
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LatestAlbum;

