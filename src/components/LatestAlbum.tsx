"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isPaused, setIsPaused] = useState(false);
  const [isDiskPaused, setIsDiskPaused] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const [dragStartRotation, setDragStartRotation] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const diskRef = useRef<HTMLDivElement>(null);
  
  // Sort albums by createdAt (newest first)
  const sortedAlbums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  const currentAlbum = sortedAlbums[currentAlbumIndex];

  const handlePrevious = () => {
    if (sortedAlbums.length > 0) {
      setIsPaused(true);
      setCurrentAlbumIndex((prev) => (prev === 0 ? sortedAlbums.length - 1 : prev - 1));
      // Resume auto-slide after 3 seconds
      setTimeout(() => setIsPaused(false), 3000);
    }
  };

  const handleNext = () => {
    if (sortedAlbums.length > 0) {
      setIsPaused(true);
      setCurrentAlbumIndex((prev) => (prev === sortedAlbums.length - 1 ? 0 : prev + 1));
      // Resume auto-slide after 3 seconds
      setTimeout(() => setIsPaused(false), 3000);
    }
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for a swipe
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - next
        handleNext();
      } else {
        // Swipe right - previous
        handlePrevious();
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Calculate angle from center point for disk rotation
  const getAngle = (clientX: number, clientY: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    return (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
  };

  // Handle mouse down for dragging disk
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!diskRef.current) return;
    setIsDragging(true);
    setIsDiskPaused(true);
    const angle = getAngle(e.clientX, e.clientY, diskRef.current);
    setDragStartAngle(angle);
    setDragStartRotation(rotation);
  };

  // Handle mouse move for dragging disk
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !diskRef.current) return;
    const angle = getAngle(e.clientX, e.clientY, diskRef.current);
    const deltaAngle = angle - dragStartAngle;
    setRotation(dragStartRotation + deltaAngle);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    // Resume auto-spin after a delay
    setTimeout(() => setIsDiskPaused(false), 2000);
  };

  // Handle touch events for mobile disk rotation
  const handleDiskTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent album swipe
    if (!diskRef.current) return;
    setIsDragging(true);
    setIsDiskPaused(true);
    const touch = e.touches[0];
    const angle = getAngle(touch.clientX, touch.clientY, diskRef.current);
    setDragStartAngle(angle);
    setDragStartRotation(rotation);
  };

  const handleDiskTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent album swipe
    if (!isDragging || !diskRef.current) return;
    const touch = e.touches[0];
    const angle = getAngle(touch.clientX, touch.clientY, diskRef.current);
    const deltaAngle = angle - dragStartAngle;
    setRotation(dragStartRotation + deltaAngle);
  };

  const handleDiskTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent album swipe
    setIsDragging(false);
    setTimeout(() => setIsDiskPaused(false), 2000);
  };

  // Auto-slide functionality
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only set up auto-slide if there's more than one album and not paused/loading
    if (sortedAlbums.length > 1 && !isLoading && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentAlbumIndex((prev) => (prev === sortedAlbums.length - 1 ? 0 : prev + 1));
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sortedAlbums.length, isLoading, isPaused]);

  // Auto-rotate disk when not paused or dragging - DISABLED
  // useEffect(() => {
  //   if (isDiskPaused || isDragging) return;
  //   
  //   const interval = setInterval(() => {
  //     setRotation((prev) => (prev + 1) % 360);
  //   }, 50); // Smooth rotation

  //   return () => clearInterval(interval);
  // }, [isDiskPaused, isDragging]);

  if (isLoading) {
    return (
      <section className="min-h-0 lg:min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* Left dotted line */}
        <div className="hidden md:block absolute left-4 sm:left-6 lg:left-12 top-0 bottom-0 w-px border-l-2 border-dotted border-gray-500/30 z-0"></div>
        {/* Right dotted line */}
        <div className="hidden md:block absolute right-4 sm:right-6 lg:right-12 top-0 bottom-0 w-px border-r-2 border-dotted border-gray-500/30 z-0"></div>
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
    <>
    <section className="min-h-0 lg:min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12">
        {/* Left dotted line */}
        <div className="hidden md:block absolute left-4 sm:left-6 lg:left-12 top-0 bottom-0 w-px border-l-2 border-dotted border-gray-500/30 z-0"></div>
        {/* Right dotted line */}
        <div className="hidden md:block absolute right-4 sm:right-6 lg:right-12 top-0 bottom-0 w-px border-r-2 border-dotted border-gray-500/30 z-0"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Album Content */}
        <div 
          className="relative flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Navigation Arrow */}
          {sortedAlbums.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={handlePrevious}
              className="text-white p-3 sm:p-4 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center z-10 lg:absolute lg:left-0"
              aria-label="Previous album"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
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
                className="flex flex-col lg:grid lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-6 items-center"
              >
                {/* Album Cover */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto order-1 lg:order-1"
                >
                  <div
                    ref={diskRef}
                    className="relative w-full h-full bg-white rounded-lg overflow-hidden cursor-grab active:cursor-grabbing group touch-manipulation transition-transform duration-75"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleDiskTouchStart}
                    onTouchMove={handleDiskTouchMove}
                    onTouchEnd={handleDiskTouchEnd}
                    onMouseEnter={() => setIsDiskPaused(true)}
                    onMouseLeave={() => {
                      handleMouseUp();
                      if (!isDragging) {
                        setTimeout(() => setIsDiskPaused(false), 2000);
                      }
                    }}
                    onClick={(e) => {
                      if (!isDragging) {
                        navigate(`/album/${encodeURIComponent(currentAlbum.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`);
                      }
                    }}
                  >
                    <img
                      src={currentAlbum.image}
                      alt={currentAlbum.title}
                      className="w-full h-full object-cover rounded-lg pointer-events-none"
                    />
                  </div>
                </motion.div>

                {/* Album Info */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-4 sm:space-y-6 lg:space-y-8 w-full order-2 lg:order-2"
                >
                  {/* Album Title */}
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight leading-tight eagle-lake">
                      {mainTitle || currentAlbum.title}
                    </h2>
                    {subtitle && (
                      <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl uppercase tracking-tight leading-tight eagle-lake">
                        ({subtitle})
                      </h3>
                    )}
                    {currentAlbum.year && (
                      <p className="text-white/60 text-xs sm:text-sm md:text-base uppercase tracking-wider mt-2">
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
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                      {currentAlbum.links.map((link, linkIndex) => (
                        <Button
                          key={link.id || linkIndex}
                          asChild
                          className="bg-transparent text-white border border-white rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px]"
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
                    className="bg-transparent text-white border border-white rounded-full px-4 sm:px-6 py-3 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px] w-full sm:w-auto"
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
              className="text-white p-3 sm:p-4 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center z-10 lg:absolute lg:right-0"
              aria-label="Next album"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </motion.button>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

export default LatestAlbum;
