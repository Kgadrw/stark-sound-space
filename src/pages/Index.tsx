import Hero from "@/components/Hero";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";

const Index = () => {
  const { isHidden } = useSidebar();
  return (
    <>
      <Sidebar />
      <div className={`min-h-screen bg-background pt-16 md:pt-0 transition-all duration-300 ${isHidden ? "md:pl-0" : "md:pl-72"}`}>
        <Hero />
      </div>
    </>
  );
};

export default Index;
