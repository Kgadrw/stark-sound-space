import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";

const formatTourDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
};

const ToursSection = () => {
  const { content, isLoading } = useContent();
  const tours = content.tours;

  if (isLoading) {
    return (
      <section id="tours" className="py-24 bg-background relative overflow-hidden p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <Skeleton className="h-16 w-48 mb-16 bg-muted" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!tours.length) {
    return (
      <section id="tours" className="py-24 bg-background relative overflow-hidden p-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-4">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-green-500">TOURS</h2>
          <p className="text-gray-400 text-lg">No tour dates announced. Add locations and ticket links in the admin dashboard.</p>
        </div>
      </section>
    );
  }
  return (
    <section id="tours" className="py-24 bg-background relative overflow-hidden p-4">
      {/* Diagonal lines background */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-foreground transform -rotate-45"
            style={{
              width: '200%',
              top: `${i * 10}%`,
              left: '-50%'
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter text-green-500">TOURS</h2>
        
        <div className="space-y-4">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              id={`tour-card-${tour.id}`}
              data-search-item="tour"
              data-search-label={`Tour · ${tour.city}`}
              data-search-category="Tour"
              data-search-description={`${tour.date} · ${tour.venue}`}
              data-search-keywords={[tour.city, tour.venue, tour.date].join("|")}
              data-search-target="tours"
              data-search-target-element={`tour-card-${tour.id}`}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border-2 border-border hover:border-foreground transition-all duration-500 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover sweep effect */}
              <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 opacity-5" />
              
              <div className="flex-1 space-y-2 mb-4 md:mb-0 relative z-10">
                <div className="flex items-center gap-3 text-gray-medium">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium font-mono group-hover:tracking-wider transition-all duration-300">
                    {formatTourDate(tour.date)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold group-hover:translate-x-2 transition-transform duration-300">{tour.city}</h3>
                <div className="flex items-center gap-3 text-gray-medium">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{tour.venue}</span>
                </div>
              </div>
              
              <Button asChild className="w-full md:w-auto relative z-10 group-hover:scale-105 transition-transform duration-300 border-white/20 text-white hover:bg-green-500/20 hover:border-green-500 hover:text-green-400" variant="outline">
                <a href={tour.ticketUrl} target="_blank" rel="noopener noreferrer">
                  GET TICKETS
                </a>
              </Button>
              
              {/* Index number */}
              <div className="absolute top-4 right-4 text-6xl font-bold opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursSection;
