import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import { Play } from "lucide-react";

const albums = [
  {
    id: 1,
    title: "LATEST ALBUM",
    year: "2024",
    image: album1,
  },
  {
    id: 2,
    title: "SECOND ALBUM",
    year: "2023",
    image: album2,
  },
  {
    id: 3,
    title: "DEBUT ALBUM",
    year: "2022",
    image: album3,
  },
];

const MusicSection = () => {
  return (
    <section id="music" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">MUSIC</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <div
              key={album.id}
              className="group relative overflow-hidden bg-card border border-border hover:border-foreground transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 ml-1" fill="currentColor" />
                </button>
              </div>
              
              <div className="p-6 border-t border-border">
                <h3 className="text-xl font-bold mb-1">{album.title}</h3>
                <p className="text-gray-medium">{album.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
