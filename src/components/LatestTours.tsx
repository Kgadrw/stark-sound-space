import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

const formatTourDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
};

const LatestTours = () => {
  const { content, isLoading } = useContent();
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";

  // Sort tours by date (newest first) and get the latest ones
  const latestTours = useMemo(() => {
    const sorted = [...content.tours].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
    return sorted; // Return all tours, or you can limit with .slice(0, N)
  }, [content.tours]);

  if (isLoading) {
    return (
      <section className="relative bg-black py-8 sm:py-12 px-4 sm:px-6 lg:px-12 overflow-hidden" style={{ background: backgroundStyle }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
        {/* Left dotted line */}
        <div className="hidden md:block absolute left-4 sm:left-6 lg:left-12 top-0 bottom-0 w-px border-l-2 border-dotted border-gray-500/30 z-[5]"></div>
        {/* Right dotted line */}
        <div className="hidden md:block absolute right-4 sm:right-6 lg:right-12 top-0 bottom-0 w-px border-r-2 border-dotted border-gray-500/30 z-[5]"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <Skeleton className="h-12 w-32 mx-auto bg-white/10" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (latestTours.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-black py-8 sm:py-12 px-4 sm:px-6 lg:px-12 overflow-hidden" style={{ background: backgroundStyle }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0" style={{ background: backgroundStyle }} />
      {/* Left dotted line */}
      <div className="absolute left-4 sm:left-6 lg:left-12 top-0 bottom-0 w-px border-l-2 border-dotted border-gray-500/30 z-[5]"></div>
      {/* Right dotted line */}
      <div className="absolute right-4 sm:right-6 lg:right-12 top-0 bottom-0 w-px border-r-2 border-dotted border-gray-500/30 z-[5]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-[0.1em] text-white uppercase">
            Tours
          </h2>
        </motion.div>

        {/* Tours List */}
        <div className="space-y-3 sm:space-y-4">
          {latestTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 bg-black/40 border-2 border-white/10 hover:border-white/30 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover sweep effect */}
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 opacity-5" />
              
              <div className="flex-1 space-y-2 mb-4 md:mb-0 relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 text-white/60">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium group-hover:tracking-wider transition-all duration-300">
                    {formatTourDate(tour.date)}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-white group-hover:translate-x-2 transition-transform duration-300">
                  {tour.city}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 text-white/60">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{tour.venue}</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="w-full md:w-auto relative z-10 group-hover:scale-105 transition-transform duration-300 border-white/20 text-white hover:bg-white/10 hover:border-white/40 touch-manipulation min-h-[44px] text-xs sm:text-sm"
                variant="outline"
              >
                <a href={tour.ticketUrl} target="_blank" rel="noopener noreferrer">
                  GET TICKETS
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestTours;

