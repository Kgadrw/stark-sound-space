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
        <section className="min-h-screen bg-black relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 md:py-24">
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

  const newspaperStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
    .newspaper-headline {
      font-family: "Playfair Display", serif;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    .newspaper-body {
      font-family: "Crimson Text", serif;
      font-size: 1.125rem;
      line-height: 1.8;
    }
    .newspaper-date {
      font-family: "Crimson Text", serif;
      font-style: italic;
    }
    .newspaper-columns {
      column-count: 3;
      column-gap: 2rem;
      column-rule: 1px solid rgba(255,255,255,0.1);
    }
    @media (max-width: 1024px) {
      .newspaper-columns {
        column-count: 2;
      }
    }
    @media (max-width: 768px) {
      .newspaper-columns {
        column-count: 1;
      }
    }
  `;

  return (
    <>
      <style>{newspaperStyle}</style>
      <Navbar />
      <section className="min-h-screen bg-black relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 md:py-24">
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
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

          {/* Newspaper Header */}
          <div className="border-t-4 border-b-4 border-white py-4 mb-8">
            <div className="flex justify-between items-center">
              <div className="text-xs font-mono text-white/60">VOL. 1, NO. 1</div>
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-widest newspaper-headline text-white" style={{ fontFamily: '"Playfair Display", serif' }}>NEL NGABO</h2>
              </div>
              <div className="text-xs font-mono text-white/60">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h1 className="newspaper-headline text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
              {album.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-white/60 newspaper-date">
              {album.year && <span>Published {album.year}</span>}
              <span>•</span>
              <span>By Nel Ngabo</span>
            </div>
            <div className="border-t-2 border-white/30 my-4"></div>
          </motion.div>

          {/* Album Cover - Large Feature Image */}
          {album.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="border-4 border-white/20 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-full h-auto object-cover"
                  style={{ filter: 'brightness(0.9) contrast(105%)' }}
                />
              </div>
              {album.summary && (
                <p className="text-xs text-white/60 italic mt-2 text-center newspaper-date">
                  {album.summary}
                </p>
              )}
            </motion.div>
          )}

          {/* Multi-column Layout for Description */}
          {album.description && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <div className="border-t-2 border-b-2 border-white/30 py-2 mb-4">
                <p className="text-xs font-bold tracking-widest text-white uppercase">FEATURED STORY</p>
              </div>
              <div className="mb-4 newspaper-columns">
                <p className="newspaper-body text-white/90 text-lg leading-relaxed">
                  <span className="first-letter:float-left first-letter:text-8xl first-letter:font-bold first-letter:mr-2 first-letter:leading-none first-letter:text-white">
                    {album.description.charAt(0)}
                  </span>
                  {album.description.slice(1)}
                </p>
              </div>
            </motion.div>
          )}

          {/* Tracklist Section - Newspaper Style */}
          {album.tracks && album.tracks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8 border-t-4 border-white/30 pt-6"
            >
              <div className="border-b-2 border-white/30 pb-2 mb-4">
                <h3 className="text-2xl md:text-3xl font-bold newspaper-headline text-white">TRACKLIST</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                {album.tracks.map((track, trackIndex) => (
                  <motion.div
                    key={`${track}-${trackIndex}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + trackIndex * 0.02 }}
                    className="flex items-center gap-3 py-2 border-b border-white/20"
                  >
                    <span className="text-xs font-bold text-white/60 w-6 font-mono">{String(trackIndex + 1).padStart(2, "0")}.</span>
                    <span className="newspaper-body text-white/90 flex-1">{track}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Streaming Links - Classified Ads Style */}
          {album.links && album.links.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="border-t-4 border-white/30 pt-6"
            >
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white p-6">
                <h3 className="text-xl font-bold mb-4 newspaper-headline text-white">AVAILABLE NOW</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {album.links.map((link, linkIndex) => (
                    <motion.div
                      key={link.id || linkIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + linkIndex * 0.05 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/50 bg-transparent text-white hover:bg-white hover:text-black transition w-full"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <span>{link.label || "Stream Now"}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Newspaper Footer */}
          <div className="border-t-4 border-white/30 mt-12 pt-4 mb-0">
            <div className="flex justify-between items-center text-xs text-white/60 font-mono">
              <span>© {new Date().getFullYear()} NEL NGABO</span>
              <span>PAGE 1</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AlbumDetail;

