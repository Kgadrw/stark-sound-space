"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const LatestAlbum = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";
  
  // Sort albums by createdAt (newest first)
  const sortedAlbums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const currentAlbum = sortedAlbums[currentAlbumIndex];

  const handlePrevious = () => {
    if (sortedAlbums.length > 0) {
      setCurrentAlbumIndex((prev) => (prev === 0 ? sortedAlbums.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (sortedAlbums.length > 0) {
      setCurrentAlbumIndex((prev) => (prev === sortedAlbums.length - 1 ? 0 : prev + 1));
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6" style={{ background: backgroundStyle }}>
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <Skeleton className="aspect-square w-full rounded-lg bg-white/10" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-64 bg-white/10" />
              <Skeleton className="h-6 w-48 bg-white/10" />
              <Skeleton className="h-12 w-32 bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!sortedAlbums.length || !currentAlbum) {
    return null;
  }

  // Split title into main title and subtitle if it contains parentheses
  const titleParts = currentAlbum.title.split(/(\([^)]+\))/);
  const mainTitle = titleParts[0].trim();
  const subtitle = titleParts[1]?.replace(/[()]/g, '') || '';

  return (
    <section className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12" style={{ background: backgroundStyle }}>
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Album Content */}
        <div className="relative flex items-center justify-center gap-4 lg:gap-8">
          {/* Left Navigation Arrow */}
          {sortedAlbums.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={handlePrevious}
              className="text-white p-2 z-10"
              aria-label="Previous album"
            >
              <ChevronLeft className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
            </motion.button>
          )}

          {/* Album Content Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-6xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAlbum.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
              >
                {/* Album Cover */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative aspect-square w-full max-w-lg mx-auto"
                >
                  <div
                    className="relative w-full h-full bg-white rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => navigate(`/album/${encodeURIComponent(currentAlbum.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
                  >
                    <img
                      src={currentAlbum.image}
                      alt={currentAlbum.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Parental Advisory Label */}
                    <div className="absolute bottom-2 right-2 bg-black px-2 py-1">
                      <p className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight">
                        PARENTAL ADVISORY<br />EXPLICIT CONTENT
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Album Info */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-6 lg:space-y-8"
                >
                  {/* Album Title */}
                  <div className="space-y-2">
                    <h2 className="text-white font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-tight leading-tight" style={{ fontFamily: 'sans-serif' }}>
                      {mainTitle || currentAlbum.title}
                    </h2>
                    {subtitle && (
                      <h3 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight leading-tight" style={{ fontFamily: 'sans-serif' }}>
                        ({subtitle})
                      </h3>
                    )}
                    {currentAlbum.year && (
                      <p className="text-white/60 text-sm sm:text-base uppercase tracking-wider mt-2">
                        {currentAlbum.year}
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  {currentAlbum.summary && (
                    <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                      {currentAlbum.summary}
                    </p>
                  )}

                  {/* Streaming Platform Links */}
                  {currentAlbum.links && currentAlbum.links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {currentAlbum.links.map((link, linkIndex) => (
                        <Button
                          key={link.id || linkIndex}
                          asChild
                          className="bg-transparent text-white border border-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <span>{link.label || "Stream Now"}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* View Album Button */}
                  <Button
                    onClick={() => navigate(`/album/${encodeURIComponent(currentAlbum.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`)}
                    className="bg-transparent text-white border border-white rounded-full px-6 py-2 text-sm font-medium transition-all duration-200"
                  >
                    View Album
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Navigation Arrow */}
          {sortedAlbums.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={handleNext}
              className="text-white p-2 z-10"
              aria-label="Next album"
            >
              <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestAlbum;
