import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content } = useContent();

  // Support both ID and slug-based URLs
  const video = content.videos.find((v) => {
    if (v.id === id) return true;
    const slug = encodeURIComponent(v.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    return decodeURIComponent(id || '') === slug || id === slug;
  });
  useEffect(() => {
    if (!video && content.videos.length > 0) {
      // Video not found, redirect to videos page
      navigate("/videos");
    } else if (video) {
      // Hide ID from URL after loading - replace with slug
      const cleanUrl = `/video/${encodeURIComponent(video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`;
      const currentSlug = cleanUrl.split('/').pop();
      if (id && id !== currentSlug && !id.match(/^[a-z0-9-]+$/i) && window.location.pathname.includes('/video/')) {
        window.history.replaceState(null, '', cleanUrl);
      }
    }
  }, [video, content.videos.length, navigate]);

  if (!video) {
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
              <p className="text-white/60 text-lg uppercase tracking-[0.2em]">Video not found</p>
              <Button onClick={() => navigate("/videos")} variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                Back to Videos
              </Button>
            </motion.div>
          </div>
          <Footer />
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

  // Get YouTube URL - use youtubeUrl if available, otherwise construct from videoId
  const youtubeUrl = (video as any).youtubeUrl || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : '');

  // Generate structured data for video
  const videoStructuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description || `${video.title} by Nel Ngabo`,
    "thumbnailUrl": video.videoId ? getYouTubeThumbnailUrl(video.videoId) : "https://nelngabo.com/hero.jpeg",
    "uploadDate": video.createdAt || new Date().toISOString(),
    "contentUrl": youtubeUrl,
    "embedUrl": embedUrl || youtubeUrl,
    "duration": "PT0M0S", // Placeholder, could be enhanced with actual duration
    "publisher": {
      "@type": "MusicGroup",
      "name": "Nel Ngabo"
    }
  };

  return (
    <>
      <SEO
        title={video.title}
        description={video.description || `Watch ${video.title} by Nel Ngabo - Official music video`}
        image={video.videoId ? getYouTubeThumbnailUrl(video.videoId) : "https://nelngabo.com/hero.jpeg"}
        type="video.other"
        keywords={`Nel Ngabo ${video.title}, Nel Ngabo video, ${video.title} music video, Rwandan music video`}
        publishedTime={video.createdAt}
        structuredData={videoStructuredData}
      />
      <style>{orbitronStyle}</style>
      <Navbar />
      <section className="min-h-screen bg-black relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 md:py-24">
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
        <Footer />
      </section>
    </>
  );
};

export default VideoDetail;

