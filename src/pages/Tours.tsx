import ToursSection from "@/components/ToursSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Tours = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <ToursSection />
        <Footer />
      </div>
    </>
  );
};

export default Tours;
