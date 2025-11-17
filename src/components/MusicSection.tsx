"use client";

import { useEffect, useState } from "react";
import { Play, Music2, Music4, LayoutGrid, List } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const fallbackListeningDestinations = [
  { label: "Spotify", url: "https://open.spotify.com/artist/nelngabo", description: "Stream in high quality" },
  { label: "Apple Music", url: "https://music.apple.com/", description: "Listen on all Apple devices" },
  { label: "YouTube", url: "https://www.youtube.com/@nelngabo9740", description: "Watch the full visual album" },
  { label: "SoundCloud", url: "https://soundcloud.com/", description: "Discover fan remixes" },
];

const MusicSection = () => {
  const orbitronStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    .orbitron {
      font-family: "Orbitron", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
    }
  `;

  const { content } = useContent();
  const albums = content.albums;
  const [selectedAlbumId, setSelectedAlbumId] = useState(albums[0]?.id);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    if (!albums.length) {
      setSelectedAlbumId(undefined);
      return;
    }
    if (!selectedAlbumId || !albums.some((album) => album.id === selectedAlbumId)) {
      setSelectedAlbumId(albums[0]?.id);
    }
  }, [albums, selectedAlbumId]);

  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId) ?? albums[0];

  const handleSelectAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    document.getElementById(`album-card-${albumId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!albums.length || !selectedAlbum) {
    return (
      <section id="music" className="py-24 bg-background relative overflow-hidden p-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-6">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter animate-fade-in">ALBUMS</h2>
          <p className="text-gray-400 text-lg">
            No albums published yet. Visit the admin dashboard to add albums, artwork, and tracklists for your fans.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{orbitronStyle}</style>
      <section id="music" className="py-24 bg-background relative overflow-hidden p-4">

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter animate-fade-in">ALBUMS</h2>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
              <span>View</span>
              <div className="flex rounded-full border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-4 py-2 transition ${
                    viewMode === "grid" ? "bg-white text-black" : "text-white/70"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1 px-4 py-2 transition ${
                    viewMode === "list" ? "bg-white text-black" : "text-white/70"
                  }`}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-12 lg:grid-cols-[1.7fr,1fr]">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-6"}>
              {albums.map((album, index) => {
                const isSelected = selectedAlbum?.id === album.id;
                return (
                  <div
                    key={album.id}
                    id={`album-card-${album.id}`}
                    data-search-item="music"
                    data-search-label={`Album · ${album.title}`}
                    data-search-category="Album"
                    data-search-description={`${album.year} · ${(album.tracks ?? []).length} tracks`}
                    data-search-keywords={[album.title, album.year, ...(album.tracks ?? [])].join("|")}
                    data-search-target="music"
                    data-search-target-element={`album-card-${album.id}`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectAlbum(album.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSelectAlbum(album.id);
                      }
                    }}
                    className={`group relative overflow-hidden border transition-all duration-500 focus:outline-none ${
                      isSelected
                        ? "border-foreground bg-card/80 shadow-[0_0_30px_rgba(236,72,153,0.2)]"
                        : "border-border bg-card hover:border-foreground"
                    } ${viewMode === "list" ? "md:flex md:items-stretch" : ""}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* IMAGE LAYER */}
                    <div
                      className={`overflow-hidden relative z-0 ${
                        viewMode === "list" ? "md:w-48 aspect-square" : "aspect-square"
                      }`}
                    >
                      <img
                        src={album.image}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground to-transparent opacity-0 group-hover:opacity-10 transform translate-x-full group-hover:translate-x-[-100%] transition-all duration-1000" />
                    </div>

                    {/* PLAY OVERLAY */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none group-hover:pointer-events-auto">
                      <button className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 ml-1" fill="currentColor" />
                      </button>
                    </div>

                    {/* INFO */}
                    <div
                      className={`relative z-20 border-t border-border bg-background p-6 ${
                        viewMode === "list" ? "flex-1" : ""
                      }`}
                    >
                      <p className="text-xs tracking-[0.4em] text-gray-medium orbitron">{album.year}</p>
                      <h3 className="text-2xl font-bold mt-2 mb-3 orbitron">{album.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{album.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="rounded-3xl border border-border/60 bg-card/60 p-6 lg:p-8 backdrop-blur-xl self-start lg:sticky lg:top-24">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Now Viewing</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-tight">{selectedAlbum.title}</h3>
                  <p className="text-gray-400">{selectedAlbum.year}</p>
                </div>

                {selectedAlbum.description && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-3">About This Album</p>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{selectedAlbum.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Tracklist</p>
                  <ul className="mt-4 space-y-3">
                    {(selectedAlbum.tracks?.length ? selectedAlbum.tracks : ["No tracks yet"]).map((track, index) => (
                      <li
                        key={`${track}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2"
                      >
                        <span className="flex items-center gap-3 text-sm text-white/90">
                          <span className="text-xs text-gray-500 w-6">{String(index + 1).padStart(2, "0")}</span>
                          {track}
                        </span>
                        <Music2 className="h-4 w-4 text-pink-400" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Where to listen</p>
                  <div className="mt-4 space-y-3">
                    {(selectedAlbum.links?.length ? selectedAlbum.links : fallbackListeningDestinations).map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-white/40 hover:bg-white/10"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-white">{link.label}</span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60 text-xs">{link.description}</span>
                        </span>
                        <Music4 className="h-4 w-4 text-white/50 transition group-hover:text-white" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default MusicSection;
