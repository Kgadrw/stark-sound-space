"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const MusicSection = () => {
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
  const albums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const currentAlbum = albums[currentAlbumIndex];

  const handlePrevious = () => {
    if (albums.length > 0) {
      setCurrentAlbumIndex((prev) => (prev === 0 ? albums.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (albums.length > 0) {
      setCurrentAlbumIndex((prev) => (prev === albums.length - 1 ? 0 : prev + 1));
    }
  };

  if (isLoading) {
    return (
      <section id="music" className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6" style={{ background: backgroundStyle }}>
        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32 bg-white/10" />
            <Skeleton className="h-16 w-64 bg-white/10" />
            <Skeleton className="h-6 w-48 bg-white/10" />
            <Skeleton className="h-12 w-24 bg-white/10" />
          </div>
          <Skeleton className="aspect-square w-full rounded-lg bg-white/10" />
        </div>
      </section>
    );
  }

  if (!albums.length) {
    return (
      <section id="music" className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-6" style={{ background: backgroundStyle }}>
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

  // Split title into main title and subtitle if it contains parentheses
  const titleParts = currentAlbum.title.split(/(\([^)]+\))/);
  const mainTitle = titleParts[0].trim();
  const subtitle = titleParts[1]?.replace(/[()]/g, '') || '';

  return (
    <section id="music" className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12" style={{ background: backgroundStyle }}>
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 lg:space-y-12"
        >
          {/* MUSIC Label */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider"
            style={{ fontFamily: 'sans-serif' }}
          >
            MUSIC
          </motion.h1>

          {/* Song Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2"
          >
            <h2 className="text-white font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-tight leading-tight" style={{ fontFamily: 'sans-serif' }}>
              {mainTitle || currentAlbum.title}
            </h2>
            {subtitle && (
              <h3 className="text-white font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-tight leading-tight" style={{ fontFamily: 'sans-serif' }}>
                ({subtitle})
              </h3>
            )}
          </motion.div>

          {/* Navigation Arrows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={handlePrevious}
              className="text-white p-2"
              aria-label="Previous album"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <button
              onClick={handleNext}
              className="text-white p-2"
              aria-label="Next album"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side - Album Cover */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-square w-full max-w-lg mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAlbum.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
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
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default MusicSection;
