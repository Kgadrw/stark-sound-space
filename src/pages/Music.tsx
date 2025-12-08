import MusicSection from "@/components/MusicSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/context/ContentContext";

const Music = () => {
  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-black relative overflow-hidden"
        style={{
          backgroundImage: 'url(/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10">
          <MusicSection />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Music;

