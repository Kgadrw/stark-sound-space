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
    <section id="tours" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">TOURS</h2>
        
        <div className="space-y-4">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border border-border hover:border-foreground transition-all duration-300"
            >
              <div className="flex-1 space-y-2 mb-4 md:mb-0">
                <div className="flex items-center gap-3 text-gray-medium">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{tour.date}</span>
                </div>
                <h3 className="text-2xl font-bold">{tour.city}</h3>
                <div className="flex items-center gap-3 text-gray-medium">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{tour.venue}</span>
                </div>
              </div>
              
              <Button className="w-full md:w-auto">
                GET TICKETS
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursSection;
