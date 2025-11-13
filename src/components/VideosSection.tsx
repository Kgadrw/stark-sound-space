import { Play } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "LATEST MUSIC VIDEO",
    views: "2.5M",
  },
  {
    id: 2,
    title: "BEHIND THE SCENES",
    views: "1.8M",
  },
  {
    id: 3,
    title: "LIVE PERFORMANCE",
    views: "3.2M",
  },
  {
    id: 4,
    title: "STUDIO SESSION",
    views: "1.1M",
  },
];

const VideosSection = () => {
  return (
    <section id="videos" className="py-24 bg-muted relative">
      {/* Creative grid pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute border-t border-foreground"
            style={{
              top: `${i * 5}%`,
              left: 0,
              right: 0
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">VIDEOS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group relative aspect-video bg-card border-2 border-border hover:border-foreground transition-all duration-500 overflow-hidden cursor-pointer"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-dark via-foreground to-gray-dark" />
              
              {/* Animated scan line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground to-transparent h-32 opacity-20 animate-pulse" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center group-hover:scale-125 group-hover:rotate-90 transition-all duration-500">
                  <Play className="w-12 h-12 ml-1 text-foreground" fill="currentColor" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent">
                <h3 className="text-xl font-bold mb-1 transform group-hover:translate-x-2 transition-transform duration-300">{video.title}</h3>
                <p className="text-gray-medium">{video.views} views</p>
              </div>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
