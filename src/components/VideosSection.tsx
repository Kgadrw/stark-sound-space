const videos = [
  {
    id: 1,
    title: "LATEST MUSIC VIDEO",
    views: "2.5M",
    videoId: "lBnokNKI38I",
  },
  {
    id: 2,
    title: "BEHIND THE SCENES",
    views: "1.8M",
    videoId: "OpKFRBu3Czk",
  },
  {
    id: 3,
    title: "LIVE PERFORMANCE",
    views: "3.2M",
    videoId: "Yx-xJyPORGo",
  },
  {
    id: 4,
    title: "STUDIO SESSION",
    views: "1.1M",
    videoId: "sfisO-Yy4LY",
  },
];

const VideosSection = () => {
  return (
    <section id="videos" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">VIDEOS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group relative aspect-video bg-card border-2 border-border hover:border-foreground transition-all duration-500 overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
                <h3 className="text-xl font-bold mb-1 transform group-hover:translate-x-2 transition-transform duration-300">{video.title}</h3>
                <p className="text-gray-medium">{video.views} views</p>
              </div>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
