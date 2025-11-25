"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MusicSection = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";
  
  // Sort albums by createdAt (newest first)
  const albums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  if (isLoading) {
    return (
      <section id="music" className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12" style={{ background: backgroundStyle }}>
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <Skeleton className="h-12 w-48 bg-white/10 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!albums.length) {
    return (
      <section id="music" className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12" style={{ background: backgroundStyle }}>
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
    <section id="music" className="min-h-screen bg-black relative overflow-hidden px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16" style={{ background: backgroundStyle }}>
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Albums Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {albums.map((album, index) => {
            // Split title into main title and subtitle if it contains parentheses
            const titleParts = album.title.split(/(\([^)]+\))/);
            const mainTitle = titleParts[0].trim();
            const subtitle = titleParts[1]?.replace(/[()]/g, '') || '';

            return (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/album/${encodeURIComponent(album.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
              >
                {/* Album Cover */}
                <div className="relative aspect-square w-full bg-white rounded-lg overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={album.image}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Album Info */}
                <div className="space-y-2">
                  <h3 className="text-white font-bold text-lg sm:text-xl uppercase tracking-tight leading-tight" style={{ fontFamily: 'sans-serif' }}>
                    {mainTitle || album.title}
                  </h3>
                  {subtitle && (
                    <h4 className="text-white/80 font-bold text-base sm:text-lg uppercase tracking-tight leading-tight" style={{ fontFamily: 'sans-serif' }}>
                      ({subtitle})
                    </h4>
                  )}
                  {album.year && (
                    <p className="text-white/60 text-sm uppercase tracking-wider">
                      {album.year}
                    </p>
                  )}
                  {album.summary && (
                    <p className="text-white/70 text-sm line-clamp-2 mt-2">
                      {album.summary}
                    </p>
                  )}
                  
                  {/* Streaming Links */}
                  {album.links && album.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {album.links.slice(0, 2).map((link, linkIndex) => (
                        <Button
                          key={link.id || linkIndex}
                          asChild
                          variant="outline"
                          size="sm"
                          className="bg-transparent text-white border-white/30 hover:border-white hover:bg-white/10 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <span>{link.label || "Stream"}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
