import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Music2 } from "lucide-react";
import { useEffect } from "react";

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content } = useContent();

  // Support both ID and slug-based URLs
  const album = content.albums.find((a) => {
    if (a.id === id) return true;
    const slug = encodeURIComponent(a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    return decodeURIComponent(id || '') === slug || id === slug;
  });
  useEffect(() => {
    if (!album && content.albums.length > 0) {
      // Album not found, redirect to music page
      navigate("/music");
    } else if (album) {
      // Hide ID from URL after loading - replace with slug
      const cleanUrl = `/album/${encodeURIComponent(album.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`;
      const currentSlug = cleanUrl.split('/').pop();
      if (id && id !== currentSlug && !id.match(/^[a-z0-9-]+$/i) && window.location.pathname.includes('/album/')) {
        window.history.replaceState(null, '', cleanUrl);
      }
    }
  }, [album, content.albums.length, navigate]);

  if (!album) {
    return (
      <>
        <Navbar />
        <section 
          className="min-h-screen bg-black relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 md:py-24"
          style={{
            backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <p className="text-white/60 text-lg uppercase tracking-[0.2em]">Album not found</p>
              <Button onClick={() => navigate("/music")} variant="outline">
                Back to Albums
              </Button>
            </motion.div>
          </div>
          <Footer />
        </section>
      </>
    );
  }

  const orbitronStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    .orbitron {
      font-family: "Orbitron", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
    }
  `;

  return (
    <>
      <style>{orbitronStyle}</style>
      <Navbar />
      <section 
        className="min-h-screen bg-black relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 md:py-24"
        style={{
          backgroundImage: 'url(/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Button
              onClick={() => navigate("/music")}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Albums
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Album Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl aspect-square group"
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
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Album Name */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-[0.1em] orbitron mb-4">
                  {album.title}
                </h1>
                
                {/* Year */}
                {album.year && (
                  <p className="text-sm tracking-[0.4em] text-white/50 uppercase elms-sans">{album.year}</p>
                )}
              </div>

              {/* Summary */}
              {album.summary && (
                <div>
                  <p className="text-base md:text-lg text-white/70 leading-relaxed elms-sans">{album.summary}</p>
                </div>
              )}

              {/* Description */}
              {album.description && (
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">About This Album</p>
                  <p className="text-base text-white/70 leading-relaxed whitespace-pre-line elms-sans">{album.description}</p>
                </div>
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
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm px-4 py-3 hover:border-white/20 transition"
                      >
                        <span className="flex items-center gap-3 text-sm text-white/90 elms-sans">
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
                          className="border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 transition group"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 group-hover:text-white transition"
                          >
                            <span className="elms-sans group-hover:text-white transition">{link.label || "Stream Now"}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-white/60 group-hover:text-white transition" />
                          </a>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default AlbumDetail;

