import MusicSection from "@/components/MusicSection";
import Navbar from "@/components/Navbar";
import { useContent } from "@/context/ContentContext";

const Music = () => {
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
      <div className="min-h-screen bg-background" style={{ background: backgroundStyle }}>
        <MusicSection />
      </div>
    </>
  );
};

export default Music;

