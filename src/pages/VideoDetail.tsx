import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content } = useContent();

  const video = content.videos.find((v) => v.id === id);
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";

  useEffect(() => {
    if (!video && content.videos.length > 0) {
      // Video not found, redirect to videos page
      navigate("/videos");
    }
  }, [video, content.videos.length, navigate]);

  if (!video) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen bg-black relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 md:py-24" style={{ background: backgroundStyle }}>
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <p className="text-white/60 text-lg uppercase tracking-[0.2em]">Video not found</p>
              <Button onClick={() => navigate("/videos")} variant="outline">
                Back to Videos
              </Button>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  // YouTube embed URL with full controls enabled
  const embedUrl = video.videoId 
    ? `https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1&playsinline=1`
    : null;

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
      <section className="min-h-screen bg-black relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 md:py-24" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Button
              onClick={() => navigate("/videos")}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Videos
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {embedUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl">
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl flex items-center justify-center">
                  <p className="text-white/60 text-lg uppercase tracking-[0.2em]">Invalid video ID</p>
                </div>
              )}
            </motion.div>

            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Video Title */}
              <div className="text-left">
                <h1 className="text-base md:text-lg lg:text-xl font-light text-white uppercase tracking-wide elms-sans mb-4">
                  {video.title}
                </h1>
              </div>

              {/* Description */}
              {video.description && (
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">Description</p>
                  <p className="text-base text-white/70 leading-relaxed whitespace-pre-line elms-sans">{video.description}</p>
                </div>
              )}

              {/* Lyrics */}
              {video.lyrics && (
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">Lyrics</p>
                  <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-4">
                    <p className="text-base text-white/70 leading-relaxed whitespace-pre-line elms-sans">{video.lyrics}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoDetail;

