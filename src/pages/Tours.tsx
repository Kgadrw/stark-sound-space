import Navigation from "@/components/Navigation";
import ToursSection from "@/components/ToursSection";
import Footer from "@/components/Footer";

const Tours = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <ToursSection />
      </div>
      <Footer />
    </div>
  );
};

export default Tours;
