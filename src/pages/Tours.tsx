import Navigation from "@/components/Navigation";
import ToursSection from "@/components/ToursSection";
import Footer from "@/components/Footer";

const Tours = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-16">
        <ToursSection />
        <Footer />
      </div>
    </>
  );
};

export default Tours;
