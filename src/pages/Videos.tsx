import VideosSection from "@/components/VideosSection";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";

const Videos = () => {
  const { isHidden } = useSidebar();
  return (
    <>
      <Sidebar />
      <div className={`min-h-screen bg-background pt-16 md:pt-0 transition-all duration-300 ${isHidden ? "md:pl-0" : "md:pl-72"}`}>
        <VideosSection />
      </div>
    </>
  );
};

export default Videos;

