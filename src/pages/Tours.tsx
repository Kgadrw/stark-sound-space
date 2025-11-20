import ToursSection from "@/components/ToursSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useContent } from "@/context/ContentContext";

const Tours = () => {
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
      <div className="min-h-screen bg-background pt-16" style={{ background: backgroundStyle }}>
        <ToursSection />
        <Footer />
      </div>
    </>
  );
};

export default Tours;
