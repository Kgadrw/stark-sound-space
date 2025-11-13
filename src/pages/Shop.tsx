import Navigation from "@/components/Navigation";
import ShopSection from "@/components/ShopSection";
import Footer from "@/components/Footer";

const Shop = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <ShopSection />
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
