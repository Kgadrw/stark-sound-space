import ToursSection from "@/components/ToursSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useContent } from "@/context/ContentContext";

const Tours = () => {
  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-black relative overflow-hidden pt-16"
        style={{
          backgroundImage: 'url(/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10">
          <ToursSection />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Tours;
