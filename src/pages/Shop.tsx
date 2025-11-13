import Navigation from "@/components/Navigation";
import ShopSection from "@/components/ShopSection";
import Footer from "@/components/Footer";

const Shop = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-16">
        <ShopSection />
        <Footer />
      </div>
    </>
  );
};

export default Shop;
