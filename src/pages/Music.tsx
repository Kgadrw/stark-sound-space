import MusicSection from "@/components/MusicSection";
import Navbar from "@/components/Navbar";

const Music = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <MusicSection />
      </div>
    </>
  );
};

export default Music;

