import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MusicSection from "@/components/MusicSection";
import VideosSection from "@/components/VideosSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <Hero />
        <MusicSection />
        <VideosSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
