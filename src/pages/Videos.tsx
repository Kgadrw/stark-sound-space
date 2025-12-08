import VideosSection from "@/components/VideosSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/context/ContentContext";

const Videos = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden">
        <VideosSection />
        <Footer />
      </div>
    </>
  );
};

export default Videos;

