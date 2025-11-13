import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

const tours = [
  {
    id: 1,
    date: "MAR 15, 2024",
    city: "NEW YORK",
    venue: "Madison Square Garden",
  },
  {
    id: 2,
    date: "MAR 22, 2024",
    city: "LOS ANGELES",
    venue: "The Forum",
  },
  {
    id: 3,
    date: "MAR 29, 2024",
    city: "CHICAGO",
    venue: "United Center",
  },
  {
    id: 4,
    date: "APR 05, 2024",
    city: "MIAMI",
    venue: "FTX Arena",
  },
  {
    id: 5,
    date: "APR 12, 2024",
    city: "ATLANTA",
    venue: "State Farm Arena",
  },
];

const ToursSection = () => {
  return (
    <section id="tours" className="py-24 bg-background relative overflow-hidden">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">TOURS</h2>
        
        <div className="space-y-4">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border-2 border-border hover:border-foreground transition-all duration-500 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover sweep effect */}
              <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 opacity-5" />
              
              <div className="flex-1 space-y-2 mb-4 md:mb-0 relative z-10">
                <div className="flex items-center gap-3 text-gray-medium">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium font-mono group-hover:tracking-wider transition-all duration-300">{tour.date}</span>
                </div>
                <h3 className="text-2xl font-bold group-hover:translate-x-2 transition-transform duration-300">{tour.city}</h3>
                <div className="flex items-center gap-3 text-gray-medium">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{tour.venue}</span>
                </div>
              </div>
              
              <Button className="w-full md:w-auto relative z-10 group-hover:scale-105 transition-transform duration-300">
                GET TICKETS
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
