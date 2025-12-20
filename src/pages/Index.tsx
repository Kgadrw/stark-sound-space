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
