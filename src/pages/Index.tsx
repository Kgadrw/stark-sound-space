import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import LatestAlbum from "@/components/LatestAlbum";
import AudioMusicSection from "@/components/AudioMusicSection";
import LatestVideos from "@/components/LatestVideos";
import LatestTours from "@/components/LatestTours";
import Footer from "@/components/Footer";
import { useContent } from "@/context/ContentContext";

const Index = () => {
  const { content } = useContent();
  const colorSettings = content.hero.colorSettings;
  const backgroundStyle = colorSettings?.colorType === "solid"
    ? colorSettings.solidColor
    : colorSettings?.gradientColors
    ? `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`
    : "#000000";

  return (
    <>
      <Navbar />
      <Hero />
      <div className="relative z-10 bg-black mt-[100vh]" style={{ background: backgroundStyle }}>
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
