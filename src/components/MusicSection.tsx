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
    <section id="music" className="py-24 bg-background relative overflow-hidden">
      {/* Creative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-foreground rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-foreground" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter animate-fade-in">MUSIC</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, index) => (
            <div
              key={album.id}
              className="group relative overflow-hidden bg-card border border-border hover:border-foreground transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Glitch effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground to-transparent opacity-0 group-hover:opacity-10 transform translate-x-full group-hover:translate-x-[-100%] transition-all duration-1000" />
              </div>
              
              <div className="absolute inset-0 bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-125 transition-transform duration-300">
                  <Play className="w-10 h-10 ml-1" fill="currentColor" />
                </button>
              </div>
              
              <div className="p-6 border-t border-border">
                <h3 className="text-xl font-bold mb-1 group-hover:translate-x-2 transition-transform duration-300">{album.title}</h3>
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
