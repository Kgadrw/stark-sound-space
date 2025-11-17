import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { ContentState, HeroNavLink, IconPreset } from "@/types/content";
import { createId } from "@/lib/id";
import { readFileAsDataUrl } from "@/lib/file";
import { adminApi } from "@/lib/api";
import { Trash2, Plus } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/youtube";

type ContentSetter = React.Dispatch<React.SetStateAction<ContentState>>;

const navTargetOptions: Array<{ value: HeroNavLink["targetType"]; label: string }> = [
  { value: "scroll", label: "Scroll to section ID" },
  { value: "route", label: "Navigate to route" },
  { value: "external", label: "Open external link" },
];

const ctaTargetOptions = [
  { value: "scroll", label: "Scroll to section" },
  { value: "route", label: "Navigate to route" },
  { value: "external", label: "Open link (same tab)" },
  { value: "externalBlank", label: "Open link (new tab)" },
];

const iconPresetOptions: Array<{ value: IconPreset; label: string }> = [
  { value: "spotify", label: "Spotify" },
  { value: "appleMusic", label: "Apple Music" },
  { value: "youtube", label: "YouTube" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X / Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "mail", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "website", label: "Website" },
];

export const HeroEditor = ({
  content,
  setContent,
  refreshContent,
}: {
  content: ContentState;
  setContent: ContentSetter;
  refreshContent: () => Promise<void>;
}) => {
  const hero = content.hero;
  const updateHero = (patch: Partial<ContentState["hero"]>) =>
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...patch },
    }));

  const updateHeroCollection = <K extends keyof ContentState["hero"]>(key: K, value: ContentState["hero"][K]) =>
    updateHero({ [key]: value } as Partial<ContentState["hero"]>);

  const updateNavLink = (id: string, patch: Partial<HeroNavLink>) => {
    updateHeroCollection(
      "navLinks",
      hero.navLinks.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    );
  };

  const addNavLink = () => {
    updateHeroCollection("navLinks", [
      ...hero.navLinks,
      { id: createId("nav"), label: "New Link", targetType: "scroll", targetValue: "music" },
    ]);
  };

  const removeNavLink = (id: string) => {
    updateHeroCollection(
      "navLinks",
      hero.navLinks.filter((link) => link.id !== id),
    );
  };

  const updateStreaming = (
    id: string,
    patch: Partial<ContentState["hero"]["streamingPlatforms"][number]>,
  ) => {
    updateHeroCollection(
      "streamingPlatforms",
      hero.streamingPlatforms.map((platform) => (platform.id === id ? { ...platform, ...patch } : platform)),
    );
  };

  const addStreamingPlatform = () => {
    updateHeroCollection("streamingPlatforms", [
      ...hero.streamingPlatforms,
      { id: createId("stream"), label: "New Platform", url: "https://", preset: "spotify" },
    ]);
  };

  const removeStreamingPlatform = (id: string) => {
    updateHeroCollection(
      "streamingPlatforms",
      hero.streamingPlatforms.filter((platform) => platform.id !== id),
    );
  };

  const updateSocialLink = (
    id: string,
    patch: Partial<ContentState["hero"]["socialLinks"][number]>,
  ) => {
    updateHeroCollection(
      "socialLinks",
      hero.socialLinks.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    );
  };

  const addSocialLink = () => {
    updateHeroCollection("socialLinks", [
      ...hero.socialLinks,
      { id: createId("social"), url: "https://" },
    ]);
  };

  const removeSocialLink = (id: string) => {
    updateHeroCollection(
      "socialLinks",
      hero.socialLinks.filter((link) => link.id !== id),
    );
  };

  const persistHeroVideo = async (videoUrl: string) => {
    updateHero({ backgroundVideoUrl: videoUrl });
    try {
      await adminApi.updateHero({ videoUrl });
      await refreshContent();
    } catch (error) {
      console.error("Failed to update hero video", error);
    }
  };

  const persistHeroData = async () => {
    try {
      await adminApi.updateHero({ 
        artistName: hero.artistName,
        videoUrl: hero.backgroundVideoUrl || "",
        imageUrl: hero.backgroundImage,
        navLinks: hero.navLinks,
        streamingPlatforms: hero.streamingPlatforms,
        socialLinks: hero.socialLinks,
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save hero data", error);
    }
  };

  const persistArtistName = async (name: string) => {
    updateHero({ artistName: name });
    try {
      await adminApi.updateHero({ artistName: name });
      await refreshContent();
    } catch (error) {
      console.error("Failed to update artist name", error);
    }
  };

  const videoPreviewUrl = getYouTubeEmbedUrl(hero.backgroundVideoUrl || "");

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-black/40 text-white">
        <CardHeader>
          <CardTitle className="text-white">Hero Basics</CardTitle>
          <CardDescription className="text-white/60">Update the artist name and background YouTube video.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Artist Name</label>
            <Input 
              value={hero.artistName} 
              onChange={(event) => updateHero({ artistName: event.target.value })} 
              onBlur={(event) => persistArtistName(event.target.value)}
              className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">YouTube Video URL (Background)</label>
            <Input
              value={hero.backgroundVideoUrl || ""}
              onChange={(event) => updateHero({ backgroundVideoUrl: event.target.value })}
              onBlur={(event) => persistHeroVideo(event.target.value)}
              placeholder="https://youtu.be/lBnokNKI38I or https://www.youtube.com/watch?v=lBnokNKI38I"
              className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
            />
            <p className="text-xs text-white/50">
              Enter a YouTube video URL or video ID. This video will play as the background on the hero section.
            </p>
          </div>
          {videoPreviewUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Video Preview</label>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/20 bg-black">
                <iframe
                  src={videoPreviewUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Video Preview"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/40 text-white">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Streaming Platforms</CardTitle>
              <CardDescription className="text-white/60">Add streaming platform links displayed in the hero sidebar.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={addStreamingPlatform}>
                <Plus className="mr-2 h-4 w-4" />
                Add Platform
              </Button>
              <Button size="sm" onClick={persistHeroData}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hero.streamingPlatforms.map((platform) => (
            <div key={platform.id} className="grid gap-3 rounded-xl border border-white/20 bg-black/30 p-4 md:grid-cols-[1.5fr,1.5fr,auto]">
              <Input 
                value={platform.label} 
                onChange={(event) => updateStreaming(platform.id, { label: event.target.value })} 
                placeholder="Platform name (e.g., Spotify)"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
              />
              <Input 
                value={platform.url} 
                onChange={(event) => updateStreaming(platform.id, { url: event.target.value })} 
                placeholder="https://"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
              />
              <div className="flex gap-3">
                <Select 
                  value={platform.preset} 
                  onValueChange={(value) => updateStreaming(platform.id, { preset: value as IconPreset })}
                >
                  <SelectTrigger className="bg-black/40 text-white border-white/20">
                    <SelectValue placeholder="Icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconPresetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => removeStreamingPlatform(platform.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {!hero.streamingPlatforms.length && <p className="text-sm text-white/50">No streaming platforms configured. Click "Add Platform" to add one.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export const AlbumsEditor = ({
  content,
  setContent,
  refreshContent,
}: {
  content: ContentState;
  setContent: ContentSetter;
  refreshContent: () => Promise<void>;
}) => {
  const { albums } = content;
  const [savingAlbumId, setSavingAlbumId] = useState<string | null>(null);
  const [deletingAlbumId, setDeletingAlbumId] = useState<string | null>(null);
  const [newTracks, setNewTracks] = useState<Record<string, string>>({});

  const syncAlbumState = (updater: (prev: ContentState) => ContentState) => {
    setContent(updater);
  };

  const updateAlbum = (albumId: string, patch: Partial<ContentState["albums"][number]>) => {
    syncAlbumState((prev) => ({
      ...prev,
      albums: prev.albums.map((album) => (album.id === albumId ? { ...album, ...patch } : album)),
    }));
  };

  const addAlbum = async () => {
    const placeholder = {
      title: "New Album",
      year: new Date().getFullYear().toString(),
      coverUrl: "/Album.jpeg",
      summary: "",
      description: "",
      tracks: [],
      links: [],
    };
    try {
      await adminApi.createAlbum(placeholder);
      await refreshContent();
    } catch (error) {
      console.error("Failed to create album", error);
    }
  };

  const handleSaveAlbum = async (albumId: string) => {
    const album = albums.find((item) => item.id === albumId);
    if (!album) return;
    setSavingAlbumId(albumId);
    try {
      await adminApi.updateAlbum(albumId, {
        title: album.title,
        year: album.year,
        coverUrl: album.image,
        summary: album.summary,
        description: album.description,
        tracks: album.tracks,
        links: album.links,
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save album", error);
    } finally {
      setSavingAlbumId(null);
    }
  };

  const removeAlbum = async (albumId: string) => {
    setDeletingAlbumId(albumId);
    try {
      await adminApi.deleteAlbum(albumId);
      await refreshContent();
    } catch (error) {
      console.error("Failed to delete album", error);
    } finally {
      setDeletingAlbumId(null);
    }
  };

  const updateTracklist = (albumId: string, input: string) => {
    const tracks = input
      .split("\n")
      .map((track) => track.trim())
      .filter(Boolean);
    updateAlbum(albumId, { tracks });
  };

  const updateAlbumLink = (albumId: string, linkId: string, key: "label" | "url" | "description", value: string) => {
    const album = albums.find((item) => item.id === albumId);
    if (!album) return;
    updateAlbum(albumId, {
      links: album.links.map((link) => (link.id === linkId ? { ...link, [key]: value } : link)),
    });
  };

  const addAlbumLink = (albumId: string) => {
    const album = albums.find((item) => item.id === albumId);
    if (!album) return;
    updateAlbum(albumId, {
      links: [
        ...album.links,
        { id: createId("link"), label: "New Link", url: "https://", description: "Streaming platform" },
      ],
    });
  };

  const removeAlbumLink = (albumId: string, linkId: string) => {
    const album = albums.find((item) => item.id === albumId);
    if (!album) return;
    updateAlbum(albumId, {
      links: album.links.filter((link) => link.id !== linkId),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Albums</h2>
          <p className="text-sm text-white/50">Manage artwork, summaries, and tracklists.</p>
        </div>
        <Button onClick={addAlbum}>
          <Plus className="mr-2 h-4 w-4" />
          New Album
        </Button>
      </div>
      <div className="space-y-5">
        {albums.map((album) => (
          <Card key={album.id} className="border-white/10 bg-black/40 text-white">
            <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                {album.image && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/20 bg-black/40">
                    <img 
                      src={album.image} 
                      alt={album.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/Album.jpeg";
                      }}
                    />
                  </div>
                )}
                <div>
                  <CardTitle className="text-white">{album.title}</CardTitle>
                  <CardDescription className="text-white/60">{album.year}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSaveAlbum(album.id)}
                  disabled={savingAlbumId === album.id}
                >
                  {savingAlbumId === album.id ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAlbum(album.id)}
                  disabled={deletingAlbumId === album.id}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deletingAlbumId === album.id ? "Removing..." : "Delete"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Title</label>
                <Input value={album.title} onChange={(event) => updateAlbum(album.id, { title: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Year</label>
                <Input value={album.year} onChange={(event) => updateAlbum(album.id, { year: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Cover Image URL</label>
                <Input value={album.image} onChange={(event) => updateAlbum(album.id, { image: event.target.value })} placeholder="Image URL" className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
                <label className="text-sm text-white/50">Or upload from computer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const dataUrl = await readFileAsDataUrl(file);
                    updateAlbum(album.id, { image: dataUrl });
                  }}
                  className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>
              <div className="lg:col-span-3 space-y-2">
                <label className="text-sm font-medium text-white">Summary</label>
                <Textarea value={album.summary} rows={3} onChange={(event) => updateAlbum(album.id, { summary: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="lg:col-span-3 space-y-2">
                <label className="text-sm font-medium text-white">Full Description</label>
                <Textarea 
                  value={album.description || ""} 
                  rows={6} 
                  onChange={(event) => updateAlbum(album.id, { description: event.target.value })} 
                  placeholder="Enter a detailed description about the album, its inspiration, themes, and story..."
                  className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                />
              </div>
              <div className="lg:col-span-3 grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Tracklist (one per line)</label>
                  <Textarea
                    rows={6}
                    value={album.tracks.join("\n")}
                    onChange={(event) => updateTracklist(album.id, event.target.value)}
                    className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                  />
                  <div className="space-y-2 rounded-lg border border-white/20 bg-black/30 p-3">
                    <label className="text-sm font-medium text-white">Add Single Track</label>
                    <div className="flex gap-2">
                      <Input
                        value={newTracks[album.id] ?? ""}
                        onChange={(event) =>
                          setNewTracks((prev) => ({
                            ...prev,
                            [album.id]: event.target.value,
                          }))
                        }
                        placeholder="Enter track title"
                        className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          const value = (newTracks[album.id] ?? "").trim();
                          if (!value) return;
                          const tracks = [...album.tracks, value];
                          updateAlbum(album.id, { tracks });
                          setNewTracks((prev) => ({ ...prev, [album.id]: "" }));
                        }}
                      >
                        Add Track
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Listening Links</label>
                    <Button size="sm" variant="outline" onClick={() => addAlbumLink(album.id)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Link
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {album.links.map((link) => (
                      <div key={link.id} className="space-y-2 rounded-xl border border-white/20 bg-black/30 p-3">
                        <Input value={link.label} onChange={(event) => updateAlbumLink(album.id, link.id, "label", event.target.value)} placeholder="Label" className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
                        <Input value={link.url} onChange={(event) => updateAlbumLink(album.id, link.id, "url", event.target.value)} placeholder="https://" className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
                        <Input
                          value={link.description}
                          onChange={(event) => updateAlbumLink(album.id, link.id, "description", event.target.value)}
                          placeholder="Description"
                          className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeAlbumLink(album.id, link.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    {!album.links.length && <p className="text-sm text-white/50">No links yet.</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!albums.length && <p className="text-sm text-white/50">No albums configured yet.</p>}
      </div>
    </div>
  );
};

export const VideosEditor = ({
  content,
  setContent,
  refreshContent,
}: {
  content: ContentState;
  setContent: ContentSetter;
  refreshContent: () => Promise<void>;
}) => {
  const { videos } = content;
  const [savingVideoId, setSavingVideoId] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  const updateVideo = (videoId: string, patch: Partial<ContentState["videos"][number]>) => {
    setContent((prev) => ({
      ...prev,
      videos: prev.videos.map((video) => (video.id === videoId ? { ...video, ...patch } : video)),
    }));
  };

  const addVideo = async () => {
    const placeholder = {
      title: "New Video",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Add description",
    };
    try {
      await adminApi.createVideo(placeholder);
      await refreshContent();
    } catch (error) {
      console.error("Failed to create video", error);
    }
  };

  const handleSaveVideo = async (videoId: string) => {
    const video = videos.find((item) => item.id === videoId);
    if (!video) return;
    setSavingVideoId(videoId);
    try {
      await adminApi.updateVideo(videoId, {
        title: video.title,
        description: video.description,
        youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save video", error);
    } finally {
      setSavingVideoId(null);
    }
  };

  const removeVideo = async (videoId: string) => {
    setDeletingVideoId(videoId);
    try {
      await adminApi.deleteVideo(videoId);
      await refreshContent();
    } catch (error) {
      console.error("Failed to delete video", error);
    } finally {
      setDeletingVideoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Videos</h2>
          <p className="text-sm text-white/50">Embed YouTube videos with descriptions.</p>
        </div>
        <Button onClick={addVideo}>
          <Plus className="mr-2 h-4 w-4" />
          New Video
        </Button>
      </div>
      <div className="space-y-4">
        {videos.map((video) => {
          const thumbnailUrl = getYouTubeThumbnailUrl(video.videoId);
          return (
            <Card key={video.id} className="border-white/10 bg-black/40 text-white">
              <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  {thumbnailUrl && (
                    <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/20 bg-black/40">
                      <img 
                        src={thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-white">{video.title}</CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSaveVideo(video.id)}
                  disabled={savingVideoId === video.id}
                >
                  {savingVideoId === video.id ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVideo(video.id)}
                  disabled={deletingVideoId === video.id}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deletingVideoId === video.id ? "Removing..." : "Delete"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Title</label>
                <Input value={video.title} onChange={(event) => updateVideo(video.id, { title: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">YouTube Video ID</label>
                <Input value={video.videoId} onChange={(event) => updateVideo(video.id, { videoId: event.target.value })} placeholder="lBnokNKI38I" className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium text-white">Description</label>
                <Textarea value={video.description} rows={3} onChange={(event) => updateVideo(video.id, { description: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
            </CardContent>
            </Card>
          );
        })}
        {!videos.length && <p className="text-sm text-white/50">No videos configured yet.</p>}
      </div>
    </div>
  );
};

export const ToursEditor = ({
  content,
  setContent,
  refreshContent,
}: {
  content: ContentState;
  setContent: ContentSetter;
  refreshContent: () => Promise<void>;
}) => {
  const { tours } = content;
  const [savingTourId, setSavingTourId] = useState<string | null>(null);
  const [deletingTourId, setDeletingTourId] = useState<string | null>(null);

  const updateTour = (tourId: string, patch: Partial<ContentState["tours"][number]>) => {
    setContent((prev) => ({
      ...prev,
      tours: prev.tours.map((tour) => (tour.id === tourId ? { ...tour, ...patch } : tour)),
    }));
  };

  const addTour = async () => {
    const placeholder = {
      date: new Date().toISOString().slice(0, 10),
      city: "New City",
      venue: "Venue Name",
      ticketUrl: "https://tickets.example.com",
    };
    try {
      await adminApi.createTour(placeholder);
      await refreshContent();
    } catch (error) {
      console.error("Failed to create tour", error);
    }
  };

  const handleSaveTour = async (tourId: string) => {
    const tour = tours.find((item) => item.id === tourId);
    if (!tour) return;
    setSavingTourId(tourId);
    try {
      await adminApi.updateTour(tourId, {
        date: tour.date,
        city: tour.city,
        venue: tour.venue,
        ticketUrl: tour.ticketUrl,
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save tour", error);
    } finally {
      setSavingTourId(null);
    }
  };

  const removeTour = async (tourId: string) => {
    setDeletingTourId(tourId);
    try {
      await adminApi.deleteTour(tourId);
      await refreshContent();
    } catch (error) {
      console.error("Failed to delete tour", error);
    } finally {
      setDeletingTourId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Tours</h2>
          <p className="text-sm text-white/50">Add tour stops with ticket links.</p>
        </div>
        <Button onClick={addTour}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tour Date
        </Button>
      </div>
      <div className="space-y-4">
        {tours.map((tour) => (
          <Card key={tour.id} className="border-white/10 bg-black/40 text-white">
            <CardContent className="grid gap-4 py-6 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Date</label>
                <Input type="date" value={tour.date} onChange={(event) => updateTour(tour.id, { date: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">City</label>
                <Input value={tour.city} onChange={(event) => updateTour(tour.id, { city: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Venue</label>
                <Input value={tour.venue} onChange={(event) => updateTour(tour.id, { venue: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Ticket URL</label>
                <Input value={tour.ticketUrl} onChange={(event) => updateTour(tour.id, { ticketUrl: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="lg:col-span-4 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSaveTour(tour.id)}
                  disabled={savingTourId === tour.id}
                >
                  {savingTourId === tour.id ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTour(tour.id)}
                  disabled={deletingTourId === tour.id}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deletingTourId === tour.id ? "Removing..." : "Remove"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!tours.length && <p className="text-sm text-white/50">No tour dates configured yet.</p>}
      </div>
    </div>
  );
};



