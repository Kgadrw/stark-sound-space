import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import LatestAlbum from "@/components/LatestAlbum";
import AudioMusicSection from "@/components/AudioMusicSection";
import LatestVideos from "@/components/LatestVideos";
import LatestTours from "@/components/LatestTours";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useContent } from "@/context/ContentContext";

const Index = () => {
  const { content } = useContent();
  const latestAlbum = content.albums.length > 0 ? content.albums[0] : null;
  
  return (
    <>
      <SEO
        title="Nel Ngabo | Official Website"
        description="Official website of Nel Ngabo - Rwandan music artist. Stream latest albums including VIBRANIUM, watch official videos, discover tour dates, and explore exclusive content. Experience afro-futuristic rhythms and neon synth atmospheres."
        image="https://nelngabo.com/hero.jpeg"
        keywords="Nel Ngabo, nelngabo, Nel Ngabo music, Nel Ngabo albums, Nel Ngabo songs, Nel Ngabo videos, Nel Ngabo tours, Rwandan artist, Rwandan music, African music, Afrobeat, afro-futuristic music, Kigali artist, Nel Ngabo VIBRANIUM"
      />
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
