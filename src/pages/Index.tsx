import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import LatestAlbum from "@/components/LatestAlbum";
import AudioMusicSection from "@/components/AudioMusicSection";
import LatestVideos from "@/components/LatestVideos";
import LatestTours from "@/components/LatestTours";
import Footer from "@/components/Footer";
import { useContent } from "@/context/ContentContext";

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="relative z-10 bg-black">
        {/* Left dotted line - continuous from below hero to footer */}
        <div className="absolute left-4 sm:left-6 lg:left-12 top-0 bottom-0 w-px border-l-2 border-dotted border-gray-500/30 z-[1] pointer-events-none"></div>
        {/* Right dotted line - continuous from below hero to footer */}
        <div className="absolute right-4 sm:right-6 lg:right-12 top-0 bottom-0 w-px border-r-2 border-dotted border-gray-500/30 z-[1] pointer-events-none"></div>
        <LatestAlbum />
        <AudioMusicSection />
        <LatestVideos />
        <LatestTours />
        <Footer />
      </div>
    </>
  );
};

export default Index;
