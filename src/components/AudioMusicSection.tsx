"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, ArrowRight } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const glowAnimation = `
  @keyframes glow-pulse {
    0%, 100% {
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.8), 0 0 30px rgba(255, 0, 0, 0.6), 0 0 45px rgba(255, 0, 0, 0.4);
    }
    50% {
      box-shadow: 0 0 25px rgba(255, 0, 0, 1), 0 0 50px rgba(255, 0, 0, 0.8), 0 0 75px rgba(255, 0, 0, 0.6);
    }
  }
  .glow-pulse {
    animation: glow-pulse 2s ease-in-out infinite;
  }
`;

const AudioMusicSection = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  // Sort audios by createdAt (newest first)
  const audios = [...content.audios].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  // Calculate number of pages based on items and viewport
  const cardWidth = 300; // sm:w-[300px]
  const gap = 24; // gap-6 = 24px
  const cardWithGap = cardWidth + gap;
  
  const calculatePages = () => {
    if (!scrollContainerRef.current || audios.length === 0) return 1;
    const containerWidth = scrollContainerRef.current.clientWidth;
    const itemsPerPage = Math.max(1, Math.floor(containerWidth / cardWithGap));
    return Math.ceil(audios.length / itemsPerPage);
  };

  const [totalPages, setTotalPages] = useState(1);

  // Update total pages when container size changes
  useEffect(() => {
    const updatePages = () => {
      if (scrollContainerRef.current) {
        const pages = calculatePages();
        setTotalPages(pages);
      }
    };
    
    // Small delay to ensure container is rendered
    const timeoutId = setTimeout(updatePages, 100);
    window.addEventListener('resize', updatePages);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePages);
    };
  }, [audios.length]);

  // Update current page based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || totalPages <= 1) return;

    const updateCurrentPage = () => {
      if (!container) return;
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const scrollPercentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      const page = Math.round(scrollPercentage * (totalPages - 1));
      setCurrentPage(Math.min(Math.max(0, page), totalPages - 1));
    };

    container.addEventListener('scroll', updateCurrentPage);
    updateCurrentPage(); // Initial update
    
    return () => container.removeEventListener('scroll', updateCurrentPage);
  }, [totalPages]);

  const scroll = (direction: 'left' | 'right' | number) => {
    if (scrollContainerRef.current) {
      const scrollAmount = cardWithGap; // Width of one card + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      let targetScroll;
      
      if (typeof direction === 'number') {
        // Jump to specific page
        if (totalPages > 1 && maxScroll > 0) {
          targetScroll = (direction / (totalPages - 1)) * maxScroll;
        } else {
          targetScroll = 0;
        }
      } else if (direction === 'left') {
        targetScroll = currentScroll - scrollAmount;
        // If at the start, loop to the end
        if (targetScroll < 0) {
          targetScroll = maxScroll;
        }
      } else {
        targetScroll = currentScroll + scrollAmount;
        // If at the end, loop to the start
        if (targetScroll >= maxScroll) {
          targetScroll = 0;
        }
      }
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      
      // Update current page after smooth scroll
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const scrollLeft = scrollContainerRef.current.scrollLeft;
          const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
          const scrollPercentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
          const page = Math.round(scrollPercentage * (totalPages - 1));
          setCurrentPage(Math.min(Math.max(0, page), totalPages - 1));
        }
      }, 300);
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only set up auto-slide if there's more than one audio and not paused/loading
    if (audios.length > 1 && !isLoading && !isPaused) {
      intervalRef.current = setInterval(() => {
        scroll('right');
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [audios.length, isLoading, isPaused]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !scrollContainerRef.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        scroll('right');
      } else {
        scroll('left');
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (isLoading) {
    return (
      <section id="audio-music" className="bg-black relative overflow-hidden px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <Skeleton className="h-8 w-32 bg-white/10 mb-8" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="w-[280px] flex-shrink-0 aspect-square rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!audios.length) {
    return null;
  }

  return (
    <section id="audio-music" className="bg-black relative overflow-hidden px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8 sm:mb-12"
        >
          <h2 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider eagle-lake">
            MUSIC
          </h2>
          <button
            onClick={() => navigate('/audio-music')}
            className="text-white/70 hover:text-white transition-all duration-200 flex items-center justify-center p-2 rounded-full hover:bg-white/10 group"
            aria-label="View more music"
          >
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Scrollable Container */}
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {audios.map((audio, index) => {
  // Split title into main title and subtitle if it contains parentheses
              const titleParts = audio.title.split(/(\([^)]+\))/);
  let mainTitle = titleParts[0].trim();
  const subtitle = titleParts[1]?.replace(/[()]/g, '') || '';
  
  // Remove "by Nelngabo" or "by NEL NGABO" from title
  mainTitle = mainTitle.replace(/\s*by\s+nel\s*ngabo/gi, '').trim();

  return (
          <motion.div
                  key={audio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[280px] sm:w-[300px]"
                >
                  {/* Album Cover */}
                  <div className="relative aspect-square w-full mb-4 group">
                    <div
                      className="relative w-full h-full bg-white rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => {
                        if (audio.link) {
                          window.open(audio.link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <img
                        src={audio.image}
                        alt={audio.title || "Audio"}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Listen Button - Bottom Right */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (audio.link) {
                              window.open(audio.link, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-black/90 transition-all duration-200 touch-manipulation group glow-pulse"
                          aria-label="Listen to audio"
                        >
                          <Headphones className="h-5 w-5 transition-all duration-200 group-hover:scale-150 text-white" style={{ strokeWidth: 2 }} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Title Below Cover */}
                  <div className="px-1">
                    <h3 className="text-white/90 font-medium text-sm sm:text-base uppercase tracking-wide line-clamp-1">
                      {mainTitle || audio.title || 'Untitled'}
                    </h3>
                  </div>
            </motion.div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scroll(index)}
                  className={`transition-all duration-300 rounded-full touch-manipulation ${
                    currentPage === index
                      ? 'w-2.5 h-2.5 bg-white'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AudioMusicSection;
