import VideosSection from "@/components/VideosSection";
import Navbar from "@/components/Navbar";

const Videos = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <VideosSection />
      </div>
    </>
  );
};

export default Videos;

