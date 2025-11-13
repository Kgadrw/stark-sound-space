import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden border-0 p-4 bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/hero.jpeg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <div className="relative h-full flex items-end pb-20 px-4 sm:px-8 lg:px-12">
        <div className="space-y-6 max-w-2xl animate-fade-in">
          <div className="relative">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter relative z-10"
              style={{ fontFamily: '"Kablammo", "Oi", cursive' }}
            >
              NEL NGABO
            </h1>
            {/* Glitch effect text shadow */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter absolute top-0 left-0 opacity-50 text-gray-medium"
              style={{ transform: "translate(2px, 2px)", fontFamily: '"Kablammo", "Oi", cursive' }}
              aria-hidden="true"
            >
              NEL NGABO
            </h1>
          </div>
          <div className="text-xl md:text-2xl text-gray-medium font-mono flex flex-wrap gap-2">
            <a
              href="#music"
              className="hover:text-foreground transition-colors duration-300 cursor-pointer"
            >
              MUSIC
            </a>
            <span>•</span>
            <a
              href="#videos"
              className="hover:text-foreground transition-colors duration-300 cursor-pointer"
            >
              VIDEOS
            </a>
            <span>•</span>
            <Link
              to="/tours"
              className="hover:text-foreground transition-colors duration-300 cursor-pointer"
            >
              TOURS
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="text-lg px-8 group relative overflow-hidden">
              <span className="relative z-10">LATEST ALBUM</span>
              <div className="absolute inset-0 bg-foreground/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 group">
              <span className="group-hover:tracking-wider transition-all duration-300">WATCH NOW</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
