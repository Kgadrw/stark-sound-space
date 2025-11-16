import ToursSection from "@/components/ToursSection";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";

const Tours = () => {
  const { isHidden } = useSidebar();
  return (
    <>
      <Sidebar />
      <div className={`min-h-screen bg-background pt-24 md:pt-0 transition-all duration-300 ${isHidden ? "md:pl-0" : "md:pl-72"}`}>
        <ToursSection />
        <Footer />
      </div>
    </>
  );
};

export default Tours;
