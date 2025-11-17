import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <Hero />
      </div>
    </>
  );
};

export default Index;
