import heroImage from "@/assets/hero-image.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="relative h-full flex items-end justify-center pb-20 px-4">
        <div className="text-center space-y-6 max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
            ARTIST
          </h1>
          <p className="text-xl md:text-2xl text-gray-medium">
            MUSIC • VIDEOS • TOURS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-lg px-8">
              LATEST ALBUM
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              WATCH NOW
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
