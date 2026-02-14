import { motion } from "framer-motion";
import { ExternalLink, Play, Info, Youtube } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Videos = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  
  // Sort videos by createdAt (newest first)
  const videos = [...content.videos].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  // Get YouTube channel URL from streaming platforms
  const streamingPlatforms = content.hero.streamingPlatforms ?? [];
  const youtubePlatform = streamingPlatforms.find((platform) => platform.preset === "youtube");
  const youtubeChannelUrl = youtubePlatform?.url || content.hero.secondaryCta?.url || "https://www.youtube.com/@nelngabo9740";

  // Generate structured data for videos
  const videosStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nel Ngabo Music Videos",
    "description": "Official music videos and visual content by Nel Ngabo",
    "itemListElement": videos.map((video, index) => {
      const youtubeUrl = (video as any).youtubeUrl || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : '');
      return {
        "@type": "VideoObject",
        "position": index + 1,
        "name": video.title,
        "description": video.description || `${video.title} by Nel Ngabo`,
        "thumbnailUrl": getYouTubeThumbnailUrl(video.videoId),
        "uploadDate": video.createdAt || new Date().toISOString(),
        "contentUrl": youtubeUrl,
        "embedUrl": youtubeUrl
      };
    })
  };

  return (
    <>
      <SEO
        title="Music Videos"
        description={`Watch Nel Ngabo's official music videos, visualizers, and live performances. ${videos.length > 0 ? `Featuring ${videos[0].title} and more.` : ''}`}
        image={videos.length > 0 ? getYouTubeThumbnailUrl(videos[0].url) : "https://nelngabo.com/hero.jpeg"}
        keywords="Nel Ngabo videos, Nel Ngabo music videos, Nel Ngabo YouTube, Rwandan music videos, African music videos, Nel Ngabo official videos"
        structuredData={videosStructuredData}
      />
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden pt-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full aspect-video rounded-xl bg-white/10" />
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/60 text-lg">No videos available yet.</p>
            </div>
          ) : (
            <>
              {/* Videos Grid - Modal Style Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {videos.map((video, index) => {
                  const thumbnailUrl = getYouTubeThumbnailUrl(video.videoId);
                  const videoUrl = `/video/${encodeURIComponent(video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`;
                  // Get YouTube URL - use youtubeUrl if available, otherwise construct from videoId
                  const youtubeUrl = (video as any).youtubeUrl || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : '');
                  
                  // Card component with cursor tracking
                  const CardWithCursor = () => {
                    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
                    const cardRef = useRef<HTMLDivElement>(null);
                    const [isHovered, setIsHovered] = useState(false);

                    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                      if (!cardRef.current) return;
                      const rect = cardRef.current.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      setMousePosition({ x, y });
                    };

                    const handleMouseEnter = () => setIsHovered(true);
                    const handleMouseLeave = () => setIsHovered(false);

                    const rect = cardRef.current?.getBoundingClientRect();
                    const cardWidth = rect?.width || 0;
                    const cardHeight = rect?.height || 0;
                    
                    // Calculate which edge is closest
                    let closestEdge = '';
                    let highlightPosition = 0;
                    if (cardWidth > 0 && cardHeight > 0 && isHovered) {
                      const distTop = mousePosition.y;
                      const distRight = cardWidth - mousePosition.x;
                      const distBottom = cardHeight - mousePosition.y;
                      const distLeft = mousePosition.x;
                      const minDist = Math.min(distTop, distRight, distBottom, distLeft);
                      
                      if (minDist === distTop) {
                        closestEdge = 'top';
                        highlightPosition = mousePosition.x;
                      } else if (minDist === distRight) {
                        closestEdge = 'right';
                        highlightPosition = mousePosition.y;
                      } else if (minDist === distBottom) {
                        closestEdge = 'bottom';
                        highlightPosition = mousePosition.x;
                      } else {
                        closestEdge = 'left';
                        highlightPosition = mousePosition.y;
                      }
                    }

                    return (
                      <div
                        ref={cardRef}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="relative bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300 h-full border border-white/10"
                      >
                        {/* Cursor-following border highlight */}
                        {isHovered && closestEdge && (
                          <div
                            className="absolute pointer-events-none z-0 rounded-xl"
                            style={{
                              ...(closestEdge === 'top' && {
                                top: '-2px',
                                left: `${Math.max(0, highlightPosition - 60)}px`,
                                width: '120px',
                                height: '2px',
                                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent)',
                              }),
                              ...(closestEdge === 'bottom' && {
                                bottom: '-2px',
                                left: `${Math.max(0, highlightPosition - 60)}px`,
                                width: '120px',
                                height: '2px',
                                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent)',
                              }),
                              ...(closestEdge === 'left' && {
                                left: '-2px',
                                top: `${Math.max(0, highlightPosition - 60)}px`,
                                width: '2px',
                                height: '120px',
                                background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8), transparent)',
                              }),
                              ...(closestEdge === 'right' && {
                                right: '-2px',
                                top: `${Math.max(0, highlightPosition - 60)}px`,
                                width: '2px',
                                height: '120px',
                                background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8), transparent)',
                              }),
                            }}
                          />
                        )}
                        <div className="relative z-10 flex flex-col h-full">
                        {/* Video Thumbnail */}
                        <div className="relative w-full aspect-video flex-shrink-0">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/60">
                              <Play className="h-12 w-12 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                          
                          {/* Info Icon - Top Right */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(videoUrl);
                            }}
                            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-all duration-200 touch-manipulation"
                            aria-label="Video details"
                          >
                            <Info className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </button>
                          
                          {/* Red Play Icon - Always Visible */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-1.5 md:p-2 backdrop-blur-sm">
                              <Play className="h-6 w-6 md:h-7 md:w-7 text-red-600" fill="currentColor" />
                            </div>
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="p-3 md:p-4 space-y-1.5 bg-gradient-to-b from-transparent to-black flex flex-col flex-grow min-h-[100px] md:min-h-[110px]">
                          <div className="flex-grow">
                            {video.title && (
                              <div>
                                <h2 className="text-sm md:text-base font-bold text-white mb-0.5 break-words line-clamp-2">
                                  {video.title}
                                </h2>
                                <p className="text-gray-400 text-xs md:text-sm">Nel Ngabo</p>
                              </div>
                            )}
                          </div>

                          {/* Watch Button */}
                          <div className="pt-1 mt-auto">
                            <motion.div
                              whileHover="hover"
                              initial="initial"
                              className="relative overflow-hidden rounded-full"
                            >
                              <Button
                                asChild
                                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm w-full transition-colors duration-200"
                              >
                                <a
                                  href={youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 relative h-full"
                                >
                                  <motion.div
                                    variants={{
                                      initial: { y: 0, opacity: 1 },
                                      hover: { y: "100%", opacity: 0 }
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex items-center justify-center gap-1.5 text-white"
                                  >
                                    <Play className="h-2.5 w-2.5 md:h-3 md:w-3" fill="currentColor" />
                                    <span>Watch Now</span>
                                    <ExternalLink className="h-2 w-2 md:h-2.5 md:w-2.5" />
                                  </motion.div>
                                  <motion.div
                                    variants={{
                                      initial: { y: "-100%", opacity: 0 },
                                      hover: { y: 0, opacity: 1 }
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="flex items-center justify-center gap-1.5 text-white"
                                  >
                                    <Play className="h-2.5 w-2.5 md:h-3 md:w-3" fill="currentColor" />
                                    <span>Watch Now</span>
                                    <ExternalLink className="h-2 w-2 md:h-2.5 md:w-2.5" />
                                  </motion.div>
                                </a>
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                        </div>
                      </div>
                    );
                  };

                  return (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group h-full"
                    >
                      <CardWithCursor />
                    </motion.div>
                  );
                })}
                
                {/* View More Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: videos.length * 0.05 }}
                  className="group h-full"
                >
                  <a
                    href={youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-xl border border-white/10 flex flex-col overflow-hidden hover:border-white/20 transition-all duration-300 h-full">
                      {/* Empty Image Area */}
                      <div className="relative w-full aspect-video flex-shrink-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <Youtube className="h-8 w-8 md:h-10 md:w-10 text-red-600" fill="currentColor" />
                      </div>

                      {/* Info Section */}
                      <div className="p-3 md:p-4 space-y-1.5 bg-gradient-to-b from-transparent to-black flex flex-col flex-grow min-h-[100px] md:min-h-[110px]">
                        <div className="flex-grow flex items-center justify-center">
                          <div className="text-center">
                            <h2 className="text-sm md:text-base font-bold text-white mb-0.5">
                              View More
                            </h2>
                            <p className="text-gray-400 text-xs md:text-sm">YouTube Channel</p>
                          </div>
                        </div>

                        {/* Button Placeholder */}
                        <div className="pt-1 mt-auto">
                          <div className="h-[36px] md:h-[40px]"></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Videos;

