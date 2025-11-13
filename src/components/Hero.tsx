import heroImage from "@/assets/hero-image.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        {/* Animated overlay lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-foreground animate-pulse" />
          <div className="absolute bottom-1/3 left-0 right-0 h-px bg-foreground" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <div className="relative h-full flex items-end pb-20 px-4 sm:px-8 lg:px-12">
        <div className="space-y-6 max-w-2xl animate-fade-in">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter relative z-10">
              ARTIST
            </h1>
            {/* Glitch effect text shadow */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter absolute top-0 left-0 opacity-50 text-gray-medium" style={{ transform: 'translate(2px, 2px)' }} aria-hidden="true">
              ARTIST
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-medium font-mono">
            MUSIC • VIDEOS • TOURS
          </p>
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
