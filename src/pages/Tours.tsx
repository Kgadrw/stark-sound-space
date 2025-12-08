import ToursSection from "@/components/ToursSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useContent } from "@/context/ContentContext";

const Tours = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden pt-16">
        <ToursSection />
        <Footer />
      </div>
    </>
  );
};

export default Tours;
