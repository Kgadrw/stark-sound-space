import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import LatestAlbum from "@/components/LatestAlbum";
import LatestVideos from "@/components/LatestVideos";
import LatestTours from "@/components/LatestTours";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="relative z-10 bg-black mt-[100vh]">
        <LatestAlbum />
        <LatestVideos />
        <LatestTours />
        <Footer />
      </div>
    </>
  );
};

export default Index;
