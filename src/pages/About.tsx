import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { useNavigate } from "react-router-dom";
import { Award, Trophy, Music, Building2, Calendar, MapPin, Mail, Phone } from "lucide-react";

const About = () => {
  const { content } = useContent();
  const navigate = useNavigate();
  const artistName = content.hero.artistName || "NEL NGABO";
  const about = content.about;
  // Sort albums by createdAt (newest first)
  const albums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  // Use artist image from about, fallback to hero image
  const artistImage = about.artistImage || content.hero.backgroundImage || "/hero.jpeg";

  const elmsSansStyle = `
    .elms-sans {
      font-family: "Elms Sans", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
    }
  `;

  return (
    <>
      <style>{elmsSansStyle}</style>
      <Navbar />
      <section id="about" className="min-h-screen bg-black relative overflow-hidden pt-20 pb-2 px-4 sm:px-6 md:pt-24 md:pb-4">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6 md:space-y-8 order-2 lg:order-1"
            >
              {/* Biography */}
              {about.biography && (
                <div className="border border-white/10 bg-black/80 backdrop-blur-xl rounded-lg p-4 sm:p-6 md:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.1em] text-white uppercase mb-4 md:mb-6 eagle-lake">
                    Biography
                  </h2>
                  <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-white/70 leading-relaxed elms-sans whitespace-pre-line">
                    {about.biography}
                  </div>
                </div>
              )}

              {/* Career Highlights */}
              {about.careerHighlights && about.careerHighlights.length > 0 && (
                <div className="border border-white/10 bg-black/80 backdrop-blur-xl rounded-lg p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-[0.1em] text-white uppercase mb-4 md:mb-6 eagle-lake">
                    Career Highlights
                  </h2>
                  <div className="space-y-4 md:space-y-6">
                    {about.careerHighlights.map((highlight, index) => (
                      <div key={index}>
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{highlight.title}</h3>
                        <p className="text-sm sm:text-base text-white/70 leading-relaxed elms-sans">{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discography Summary */}
              <div className="border border-white/10 bg-black/80 backdrop-blur-xl rounded-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold tracking-[0.1em] text-white uppercase mb-4 md:mb-6 eagle-lake">
                  Discography
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {albums.map((album, index) => (
                    <div 
                      key={album.id} 
                      onClick={() => navigate(`/album/${encodeURIComponent(album.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
                      className="flex items-start gap-3 sm:gap-4 pb-3 md:pb-4 border-b border-white/10 last:border-0 md:cursor-default cursor-pointer active:opacity-70 transition-opacity md:transition-none"
                    >
                      <div className="w-10 sm:w-12 flex-shrink-0 flex flex-col gap-2">
                        <div className="text-white/50 text-xs sm:text-sm font-mono">{album.year}</div>
                        {album.image && (
                          <img 
                            src={album.image} 
                            alt={album.title}
                            className="w-full aspect-square object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">{album.title}</h3>
                        <p className="text-white/60 text-xs sm:text-sm elms-sans line-clamp-2">{album.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4 md:space-y-6 order-1 lg:order-2"
            >
              {/* Artist Image */}
              <div className="border border-white/10 bg-black/80 backdrop-blur-xl rounded-lg overflow-hidden">
                <img
                  src={artistImage}
                  alt={artistName}
                  className="w-full aspect-square object-cover"
                />
              </div>

              {/* Achievements */}
              {about.achievements && about.achievements.length > 0 && (
                <div className="border border-white/10 bg-black/80 backdrop-blur-xl rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold tracking-[0.1em] text-white uppercase mb-3 md:mb-4 flex items-center gap-2">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-pink-400 flex-shrink-0" />
                    Achievements
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {about.achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="pb-3 border-b border-white/10 last:border-0"
                    >
                      <div className="text-xs text-white/50 uppercase tracking-[0.2em] mb-1">
                        {achievement.year}
                      </div>
                      <div className="text-white font-semibold text-xs sm:text-sm mb-1 elms-sans">
                        {achievement.title}
                      </div>
                      <div className="text-white/60 text-xs elms-sans">
                        {achievement.organization}
                      </div>
                    </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards */}
              {about.awards && about.awards.length > 0 && (
                <div className="border border-white/10 bg-black/80 backdrop-blur-xl rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold tracking-[0.1em] text-white uppercase mb-3 md:mb-4 flex items-center gap-2">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-pink-400 flex-shrink-0" />
                    Awards
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    {about.awards.map((award, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="pb-3 border-b border-white/10 last:border-0"
                    >
                      <div className="text-white font-semibold text-xs sm:text-sm mb-1 elms-sans">
                        {award.title}
                      </div>
                      <div className="text-white/60 text-xs elms-sans">
                        {award.description}
                      </div>
                    </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Music Label */}
              {about.musicLabel && (
                <div className="border border-white/10 bg-black/80 backdrop-blur-xl rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold tracking-[0.1em] text-white uppercase mb-3 md:mb-4 flex items-center gap-2">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-pink-400 flex-shrink-0" />
                    RECORD LABEL
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm elms-sans">{about.musicLabel}</p>
                </div>
              )}

              {/* Contact Info */}
              {(about.location || about.email || about.phone) && (
                <div className="border border-white/10 bg-black/80 backdrop-blur-xl rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold tracking-[0.1em] text-white uppercase mb-3 md:mb-4">
                    Contact
                  </h3>
                  <div className="space-y-2 md:space-y-3 text-xs sm:text-sm elms-sans">
                    {about.location && (
                      <div className="flex items-start gap-3 text-white/70">
                        <MapPin className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{about.location}</span>
                      </div>
                    )}
                    {about.email && (
                      <a href={`mailto:${about.email}`} className="flex items-start gap-3 text-white/70 hover:text-white transition break-all">
                        <Mail className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5" />
                        <span className="break-all">{about.email}</span>
                      </a>
                    )}
                    {about.phone && (
                      <a href={`tel:${about.phone}`} className="flex items-center gap-3 text-white/70 hover:text-white transition">
                        <Phone className="h-4 w-4 text-white/50 flex-shrink-0" />
                        <span>{about.phone}</span>
                      </a>
                    )}
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

export default About;

