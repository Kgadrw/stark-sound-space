import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const VideosSection = () => {
  const { content } = useContent();
  const videos = content.videos;
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  if (!videos.length) {
    return (
      <section id="videos" className="py-24 bg-black relative p-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-4">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">VIDEOS</h2>
          <p className="text-white/70 text-lg">No videos yet. Add video embeds from the admin dashboard.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="py-24 bg-black relative p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">VIDEOS</h2>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
            <span>View</span>
            <div className="flex rounded-full border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1 px-4 py-2 transition ${viewMode === "grid" ? "bg-white text-black" : "text-white/70"}`}
              >
                <LayoutGrid className="h-4 w-4" />
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-4 py-2 transition ${viewMode === "list" ? "bg-white text-black" : "text-white/70"}`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>

        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
          {videos.map((video, index) => (
            <div
              key={video.id}
              id={`video-card-${video.id}`}
              data-search-item="video"
              data-search-label={`Video · ${video.title}`}
              data-search-category="Video"
              data-search-description={video.description || ""}
              data-search-keywords={video.title}
              data-search-target="videos"
              data-search-target-element={`video-card-${video.id}`}
              className={`group relative bg-card border-2 border-border hover:border-foreground transition-all duration-500 overflow-hidden ${viewMode === "list" ? "md:flex md:items-stretch" : "aspect-video"}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={viewMode === "list" ? "md:w-72 aspect-video relative" : "absolute inset-0"}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {viewMode === "list" && (
                <div className="flex-1 border-t border-white/5 bg-black/40 px-6 py-5 text-left">
                  <h3 className="mt-2 text-2xl font-bold text-white">{video.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{video.description}</p>
                </div>
              )}

              {/* Corner accent */}
              <div className="pointer-events-none absolute top-0 right-0 h-16 w-16 border-t-2 border-r-2 border-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
