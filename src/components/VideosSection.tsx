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
    <section id="videos" className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">VIDEOS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative aspect-video bg-card border border-border hover:border-foreground transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-dark to-foreground" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 ml-1 text-foreground" fill="currentColor" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
                <h3 className="text-xl font-bold mb-1">{video.title}</h3>
                <p className="text-gray-medium">{video.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
