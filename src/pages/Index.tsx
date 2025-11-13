import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MusicSection from "@/components/MusicSection";
import VideosSection from "@/components/VideosSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <MusicSection />
      <VideosSection />
      <Footer />
    </div>
  );
};

export default Index;
