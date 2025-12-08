import MusicSection from "@/components/MusicSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/context/ContentContext";

const Music = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden">
        <MusicSection />
        <Footer />
      </div>
    </>
  );
};

export default Music;

