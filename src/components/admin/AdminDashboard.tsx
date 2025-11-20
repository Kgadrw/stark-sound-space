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
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl, extractYouTubeVideoId } from "@/lib/youtube";
import { toast } from "sonner";

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
  { value: "boomplay", label: "Boomplay" },
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
  const [savingHero, setSavingHero] = useState(false);
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
      const response = await adminApi.updateHero({ videoUrl });
      console.log("Hero video updated successfully:", response);
      toast.success("Hero video updated!", {
        description: "The background video has been saved successfully.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to update hero video", error);
      toast.error("Failed to update hero video", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const persistHeroData = async () => {
    setSavingHero(true);
    try {
      const response = await adminApi.updateHero({ 
        artistName: hero.artistName,
        videoUrl: hero.backgroundVideoUrl || "",
        imageUrl: hero.backgroundImage,
        navLinks: hero.navLinks,
        streamingPlatforms: hero.streamingPlatforms,
        socialLinks: hero.socialLinks,
        latestAlbumName: hero.latestAlbumName,
        latestAlbumLink: hero.latestAlbumLink,
        notificationText: hero.notificationText,
        notificationLink: hero.notificationLink,
        notificationLinkText: hero.notificationLinkText,
        isNotificationVisible: hero.isNotificationVisible,
      });
      console.log("Hero saved successfully:", response);
      toast.success("Hero saved successfully!", {
        description: "All hero data has been saved to the database.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save hero data", error);
      toast.error("Failed to save hero data", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSavingHero(false);
    }
  };

  const persistArtistName = async (name: string) => {
    updateHero({ artistName: name });
    try {
      const response = await adminApi.updateHero({ artistName: name });
      console.log("Artist name updated successfully:", response);
      toast.success("Artist name updated!", {
        description: "The artist name has been saved successfully.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to update artist name", error);
      toast.error("Failed to update artist name", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const videoPreviewUrl = getYouTubeEmbedUrl(hero.backgroundVideoUrl || "");

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-black/40 text-white">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
          <CardTitle className="text-white">Hero Basics</CardTitle>
          <CardDescription className="text-white/60">Update the artist name and background YouTube video.</CardDescription>
            </div>
            <Button size="sm" onClick={persistHeroData} disabled={savingHero}>
              {savingHero ? "Saving..." : "Save Changes"}
            </Button>
          </div>
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
            <label className="text-sm font-medium text-white">Background Image URL</label>
            <Input
              value={hero.backgroundImage || ""}
              onChange={(event) => updateHero({ backgroundImage: event.target.value })}
              placeholder="/hero.jpeg or full URL"
              className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
            />
            <label className="text-sm text-white/50">Or upload from computer</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  // Check file size (limit to 2MB to avoid MongoDB document size issues)
                  const maxSizeBytes = 2 * 1024 * 1024; // 2MB
                  if (file.size > maxSizeBytes) {
                    toast.error("Image too large", {
                      description: `Image size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum of 2MB. Please compress the image or use an image hosting service and paste the URL instead.`,
                    });
                    event.target.value = '';
                    return;
                  }
                  const dataUrl = await readFileAsDataUrl(file);
                  // Check the base64 size as well
                  if (dataUrl.length > 3 * 1024 * 1024) { // ~3MB base64 limit
                    toast.error("Image too large", {
                      description: "The image is too large after encoding. Please use a smaller image or upload to an image hosting service.",
                    });
                    event.target.value = '';
                    return;
                  }
                  updateHero({ backgroundImage: dataUrl });
                  // Reset input to allow uploading same file again
                  event.target.value = '';
                  toast.success("Image loaded", {
                    description: "Click 'Save Changes' to update the background image.",
                  });
                } catch (error) {
                  console.error("Error reading file:", error);
                  toast.error("Failed to load image", {
                    description: error instanceof Error ? error.message : "Could not read the selected file.",
                  });
                  event.target.value = '';
                }
              }}
              className="w-full text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {hero.backgroundImage && (
              <div className="mt-4">
                <img
                  src={hero.backgroundImage}
                  alt="Hero background preview"
                  className="w-full h-48 object-cover rounded-lg border border-white/10"
                />
              </div>
            )}
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
          <Separator className="bg-white/10" />
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white mb-4">Navbar Latest Album</h3>
              <p className="text-xs text-white/50 mb-4">
                Customize the album name and link displayed in the navbar "Listen Now" section.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Latest Album Name</label>
                <Input
                  value={hero.latestAlbumName || "VIBRANIUM"}
                  onChange={(event) => updateHero({ latestAlbumName: event.target.value })}
                  onBlur={async () => {
                    try {
                      await adminApi.updateHero({ 
                        latestAlbumName: hero.latestAlbumName,
                        latestAlbumLink: hero.latestAlbumLink,
                      });
                      toast.success("Latest album name updated", {
                        description: "The name has been saved successfully.",
                      });
                      await refreshContent();
                    } catch (error) {
                      console.error("Failed to update latest album name", error);
                      toast.error("Failed to update name", {
                        description: error instanceof Error ? error.message : "Unknown error",
                      });
                    }
                  }}
                  placeholder="VIBRANIUM"
                  className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                />
                <p className="text-xs text-white/50">
                  The album name displayed next to the wave animation in the navbar.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Listen Now Link</label>
                <Input
                  value={hero.latestAlbumLink || ""}
                  onChange={(event) => updateHero({ latestAlbumLink: event.target.value })}
                  onBlur={async () => {
                    try {
                      await adminApi.updateHero({ 
                        latestAlbumName: hero.latestAlbumName,
                        latestAlbumLink: hero.latestAlbumLink,
                      });
                      toast.success("Latest album link updated", {
                        description: "The link has been saved successfully.",
                      });
                      await refreshContent();
                    } catch (error) {
                      console.error("Failed to update latest album link", error);
                      toast.error("Failed to update link", {
                        description: error instanceof Error ? error.message : "Unknown error",
                      });
                    }
                  }}
                  placeholder="https://open.spotify.com/album/..."
                  className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                />
                <p className="text-xs text-white/50">
                  External URL only (e.g., https://open.spotify.com/album/...). Must start with http:// or https://
                </p>
              </div>
            </div>
          </div>
          <Separator className="bg-white/10" />
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white mb-4">Notification Banner</h3>
              <p className="text-xs text-white/50 mb-4">
                Display a sliding notification banner at the top of the hero section. The banner will slide from right to left.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="notificationVisible"
                  checked={hero.isNotificationVisible ?? false}
                  onChange={(event) => updateHero({ isNotificationVisible: event.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-black/40 text-pink-600 focus:ring-pink-500 focus:ring-2"
                />
                <label htmlFor="notificationVisible" className="text-sm font-medium text-white">
                  Show Notification Banner
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Notification Text</label>
                <Textarea
                  value={hero.notificationText || ""}
                  onChange={(event) => updateHero({ notificationText: event.target.value })}
                  placeholder="New album out now! Check it out..."
                  className="bg-black/40 text-white placeholder:text-white/40 border-white/20 min-h-[80px]"
                  rows={3}
                />
                <p className="text-xs text-white/50">
                  The text to display in the notification banner. Leave empty to hide the banner.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Link URL (Optional)</label>
                  <Input
                    value={hero.notificationLink || ""}
                    onChange={(event) => updateHero({ notificationLink: event.target.value })}
                    placeholder="/music or https://..."
                    className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                  />
                  <p className="text-xs text-white/50">
                    Optional link when users click on the notification. Can be a route or external URL.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Link Text</label>
                  <Input
                    value={hero.notificationLinkText || "Learn More"}
                    onChange={(event) => updateHero({ notificationLinkText: event.target.value })}
                    placeholder="Learn More"
                    className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                  />
                  <p className="text-xs text-white/50">
                    The text for the link button. Only shown if a link URL is provided.
                  </p>
                </div>
              </div>
            </div>
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

      <Card className="border-white/10 bg-black/40 text-white">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Social Links</CardTitle>
              <CardDescription className="text-white/60">Add social media links displayed in the footer.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={addSocialLink}>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
              <Button size="sm" onClick={persistHeroData}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hero.socialLinks.map((link) => (
            <div key={link.id} className="grid gap-3 rounded-xl border border-white/20 bg-black/30 p-4 md:grid-cols-[1fr,auto]">
              <Input 
                value={link.url} 
                onChange={(event) => updateSocialLink(link.id, { url: event.target.value })} 
                placeholder="https://x.com/username or https://twitter.com/username"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
              />
              <Button variant="ghost" size="icon" onClick={() => removeSocialLink(link.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {!hero.socialLinks.length && <p className="text-sm text-white/50">No social links configured. Click "Add Link" to add one.</p>}
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

  const updateAlbum = (albumId: string, patch: Partial<ContentState["albums"][number]>) => {
    setContent((prev) => ({
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
      const response = await adminApi.createAlbum(placeholder);
      console.log("Album created successfully:", response);
      toast.success("Album created successfully!", {
        description: "A new album has been added. You can now edit it.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to create album", error);
      toast.error("Failed to create album", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleSaveAlbum = async (albumId: string) => {
    const album = albums.find((item) => item.id === albumId);
    if (!album) {
      console.error("Album not found in state:", albumId);
      toast.error("Album not found", {
        description: "The album could not be found. Please refresh the page.",
      });
      return;
    }
    
    setSavingAlbumId(albumId);
    try {
      // Ensure links have all required fields (id, label, url, description)
      const formattedLinks = Array.isArray(album.links) 
        ? album.links.map((link) => ({
            id: link.id || createId("link"),
            label: link.label || "",
            url: link.url || "",
            description: link.description || "",
          }))
        : [];
      
      const payload = {
        title: album.title || "Untitled",
        year: album.year || "",
        coverUrl: album.image || "/Album.jpeg",
        summary: album.summary || "",
        description: album.description || "",
        tracks: Array.isArray(album.tracks) ? album.tracks : [],
        links: formattedLinks,
      };
      
      console.log("Saving album:", { albumId, payload });
      console.log("Album links being sent:", formattedLinks);
      
      const response = await adminApi.updateAlbum(albumId, payload);
      console.log("Album saved successfully:", response);
      console.log("Links in response:", response.links);
      toast.success("Album saved successfully!", {
        description: `"${album.title}" has been saved to the database.`,
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save album", error);
      console.error("Album ID:", albumId);
      console.error("Album data:", album);
      console.error("Album links:", album.links);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : "Unknown error";
        
      toast.error("Failed to save album", {
        description: errorMessage,
      });
    } finally {
      setSavingAlbumId(null);
    }
  };

  const removeAlbum = async (albumId: string) => {
    const album = albums.find((item) => item.id === albumId);
    if (!album) return;
    
    if (!confirm(`Are you sure you want to delete "${album.title}"? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingAlbumId(albumId);
    try {
      await adminApi.deleteAlbum(albumId);
      await refreshContent();
      console.log("Album deleted successfully");
      toast.success("Album deleted successfully!", {
        description: `"${album.title}" has been removed from the database.`,
      });
    } catch (error) {
      console.error("Failed to delete album", error);
      toast.error("Failed to delete album", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
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
                {album.image && (
                  <div className="mt-2">
                    <img
                      src={album.image}
                      alt="Album cover preview"
                      className="w-full h-48 object-cover rounded-lg border border-white/10"
                      onError={(e) => {
                        console.error("Failed to load album image:", album.image);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <label className="text-sm text-white/50">Or upload from computer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      // Check file size (limit to 2MB to avoid MongoDB document size issues)
                      // Base64 encoding increases size by ~33%, so 2MB file = ~2.7MB base64
                      const maxSizeBytes = 2 * 1024 * 1024; // 2MB
                      if (file.size > maxSizeBytes) {
                        toast.error("Image too large", {
                          description: `Image size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum of 2MB. Please compress the image or use an image hosting service and paste the URL instead.`,
                        });
                        event.target.value = '';
                        return;
                      }
                    const dataUrl = await readFileAsDataUrl(file);
                      // Check the base64 size as well
                      if (dataUrl.length > 3 * 1024 * 1024) { // ~3MB base64 limit
                        toast.error("Image too large", {
                          description: "The image is too large after encoding. Please use a smaller image or upload to an image hosting service.",
                        });
                        event.target.value = '';
                        return;
                      }
                    updateAlbum(album.id, { image: dataUrl });
                      // Reset input to allow uploading same file again
                      event.target.value = '';
                      toast.success("Image loaded", {
                        description: "Click 'Save' to update the album cover.",
                      });
                    } catch (error) {
                      console.error("Error reading file:", error);
                      toast.error("Failed to load image", {
                        description: error instanceof Error ? error.message : "Could not read the selected file.",
                      });
                      event.target.value = '';
                    }
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
      lyrics: "",
    };
    try {
      const response = await adminApi.createVideo(placeholder);
      console.log("Video created successfully:", response);
      toast.success("Video created successfully!", {
        description: "A new video has been added. You can now edit it.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to create video", error);
      toast.error("Failed to create video", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleSaveVideo = async (videoId: string) => {
    const video = videos.find((item) => item.id === videoId);
    if (!video) return;
    setSavingVideoId(videoId);
    try {
      // Build YouTube URL from videoId if it exists, or use youtubeUrl if it's set
      let youtubeUrl = video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : "";
      
      // If there's a youtubeUrl property, use it
      if ((video as any).youtubeUrl) {
        youtubeUrl = (video as any).youtubeUrl;
      }
      
      const response = await adminApi.updateVideo(videoId, {
        title: video.title,
        description: video.description || "",
        lyrics: video.lyrics || "",
        youtubeUrl: youtubeUrl,
      });
      console.log("Video saved successfully:", response);
      toast.success("Video saved successfully!", {
        description: `"${video.title}" has been saved to the database.`,
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save video", error);
      toast.error("Failed to save video", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSavingVideoId(null);
    }
  };

  const removeVideo = async (videoId: string) => {
    const video = videos.find((item) => item.id === videoId);
    if (!video) return;
    
    if (!confirm(`Are you sure you want to delete "${video.title}"? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingVideoId(videoId);
    try {
      await adminApi.deleteVideo(videoId);
      await refreshContent();
      console.log("Video deleted successfully");
      toast.success("Video deleted successfully!", {
        description: `"${video.title}" has been removed from the database.`,
      });
    } catch (error) {
      console.error("Failed to delete video", error);
      toast.error("Failed to delete video", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setDeletingVideoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Videos</h2>
          <p className="text-sm text-white/50">Embed YouTube videos with descriptions and lyrics.</p>
        </div>
        <Button onClick={addVideo} size="lg" className="bg-white text-black hover:bg-white/90">
          <Plus className="mr-2 h-5 w-5" />
          Add New Video
        </Button>
      </div>
      
      {videos.length === 0 && (
        <Card className="border-white/10 bg-black/40 text-white">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-white mb-2">No videos yet</p>
            <p className="text-sm text-white/60 mb-6">Get started by adding your first video</p>
            <Button onClick={addVideo} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Video
            </Button>
          </CardContent>
        </Card>
      )}
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
                <label className="text-sm font-medium text-white">YouTube URL</label>
                <Input 
                  value={(video as any).youtubeUrl || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : "")} 
                  onChange={(event) => {
                    const url = event.target.value;
                    const extractedId = extractYouTubeVideoId(url);
                    if (extractedId) {
                      updateVideo(video.id, { videoId: extractedId, youtubeUrl: url } as any);
                    } else {
                      updateVideo(video.id, { youtubeUrl: url } as any);
                    }
                  }} 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  className="bg-black/40 text-white placeholder:text-white/40 border-white/20" 
                />
                <p className="text-xs text-white/50">
                  Paste a YouTube URL or video ID. The video ID will be extracted automatically.
                </p>
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium text-white">Description</label>
                <Textarea value={video.description} rows={3} onChange={(event) => updateVideo(video.id, { description: event.target.value })} className="bg-black/40 text-white placeholder:text-white/40 border-white/20" />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium text-white">Lyrics (Optional)</label>
                <Textarea 
                  value={video.lyrics || ""} 
                  rows={8} 
                  onChange={(event) => updateVideo(video.id, { lyrics: event.target.value })} 
                  placeholder="Enter song lyrics here..."
                  className="bg-black/40 text-white placeholder:text-white/40 border-white/20" 
                />
                <p className="text-xs text-white/50">
                  Optional: Add song lyrics for this video.
                </p>
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
      const response = await adminApi.createTour(placeholder);
      console.log("Tour created successfully:", response);
      toast.success("Tour created successfully!", {
        description: "A new tour has been added. You can now edit it.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to create tour", error);
      toast.error("Failed to create tour", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleSaveTour = async (tourId: string) => {
    const tour = tours.find((item) => item.id === tourId);
    if (!tour) return;
    setSavingTourId(tourId);
    try {
      const response = await adminApi.updateTour(tourId, {
        date: tour.date,
        city: tour.city,
        venue: tour.venue,
        ticketUrl: tour.ticketUrl,
      });
      console.log("Tour saved successfully:", response);
      toast.success("Tour saved successfully!", {
        description: `Tour on ${tour.date} at ${tour.venue}, ${tour.city} has been saved.`,
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save tour", error);
      toast.error("Failed to save tour", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSavingTourId(null);
    }
  };

  const removeTour = async (tourId: string) => {
    const tour = tours.find((item) => item.id === tourId);
    if (!tour) return;
    
    if (!confirm(`Are you sure you want to delete the tour on ${tour.date} at ${tour.venue}, ${tour.city}? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingTourId(tourId);
    try {
      await adminApi.deleteTour(tourId);
      await refreshContent();
      console.log("Tour deleted successfully");
      toast.success("Tour deleted successfully!", {
        description: `Tour on ${tour.date} at ${tour.venue}, ${tour.city} has been removed.`,
      });
    } catch (error) {
      console.error("Failed to delete tour", error);
      toast.error("Failed to delete tour", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
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

export const AboutEditor = ({
  content,
  setContent,
  refreshContent,
}: {
  content: ContentState;
  setContent: ContentSetter;
  refreshContent: () => Promise<void>;
}) => {
  const { about } = content;
  const [saving, setSaving] = useState(false);

  const updateAbout = (patch: Partial<ContentState["about"]>) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, ...patch },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await adminApi.updateAbout({
        biography: about.biography,
        careerHighlights: about.careerHighlights,
        achievements: about.achievements,
        awards: about.awards,
        musicLabel: about.musicLabel,
        location: about.location,
        email: about.email,
        phone: about.phone,
        artistImage: about.artistImage,
      });
      console.log("About saved successfully:", response);
      toast.success("About page saved successfully!", {
        description: "All about page content has been saved to the database.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save about", error);
      toast.error("Failed to save about page", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCareerHighlight = () => {
    updateAbout({
      careerHighlights: [...about.careerHighlights, { title: "", description: "" }],
    });
  };

  const updateCareerHighlight = (index: number, patch: Partial<ContentState["about"]["careerHighlights"][number]>) => {
    updateAbout({
      careerHighlights: about.careerHighlights.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  };

  const removeCareerHighlight = (index: number) => {
    updateAbout({
      careerHighlights: about.careerHighlights.filter((_, i) => i !== index),
    });
  };

  const addAchievement = () => {
    updateAbout({
      achievements: [...about.achievements, { year: "", title: "", organization: "" }],
    });
  };

  const updateAchievement = (index: number, patch: Partial<ContentState["about"]["achievements"][number]>) => {
    updateAbout({
      achievements: about.achievements.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  };

  const removeAchievement = (index: number) => {
    updateAbout({
      achievements: about.achievements.filter((_, i) => i !== index),
    });
  };

  const addAward = () => {
    updateAbout({
      awards: [...about.awards, { title: "", description: "" }],
    });
  };

  const updateAward = (index: number, patch: Partial<ContentState["about"]["awards"][number]>) => {
    updateAbout({
      awards: about.awards.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  };

  const removeAward = (index: number) => {
    updateAbout({
      awards: about.awards.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 mb-1">About Page Content</p>
          <h2 className="text-2xl font-semibold text-white">Customize About Page</h2>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-white/90">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="bg-black/40 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Biography</CardTitle>
          <CardDescription className="text-white/60">Main biography text displayed on the About page</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={about.biography}
            rows={8}
            onChange={(e) => updateAbout({ biography: e.target.value })}
            className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
            placeholder="Enter the artist's biography..."
          />
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Career Highlights</CardTitle>
              <CardDescription className="text-white/60">Key moments and achievements in the career</CardDescription>
            </div>
            <Button onClick={addCareerHighlight} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {about.careerHighlights.map((highlight, index) => (
            <Card key={index} className="bg-black/60 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/50">Highlight {index + 1}</span>
                  <Button
                    onClick={() => removeCareerHighlight(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Title</label>
                  <Input
                    value={highlight.title}
                    onChange={(e) => updateCareerHighlight(index, { title: e.target.value })}
                    className="bg-black/40 text-white border-white/20"
                    placeholder="e.g., Musical Journey"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Description</label>
                  <Textarea
                    value={highlight.description}
                    rows={3}
                    onChange={(e) => updateCareerHighlight(index, { description: e.target.value })}
                    className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                    placeholder="Describe this career highlight..."
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {about.careerHighlights.length === 0 && (
            <p className="text-sm text-white/50 text-center py-4">No career highlights added yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Achievements</CardTitle>
              <CardDescription className="text-white/60">Notable achievements and recognitions</CardDescription>
            </div>
            <Button onClick={addAchievement} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {about.achievements.map((achievement, index) => (
            <Card key={index} className="bg-black/60 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/50">Achievement {index + 1}</span>
                  <Button
                    onClick={() => removeAchievement(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Year</label>
                    <Input
                      value={achievement.year}
                      onChange={(e) => updateAchievement(index, { year: e.target.value })}
                      className="bg-black/40 text-white border-white/20"
                      placeholder="2024"
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-medium text-white">Title</label>
                    <Input
                      value={achievement.title}
                      onChange={(e) => updateAchievement(index, { title: e.target.value })}
                      className="bg-black/40 text-white border-white/20"
                      placeholder="Best New Artist"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Organization</label>
                  <Input
                    value={achievement.organization}
                    onChange={(e) => updateAchievement(index, { organization: e.target.value })}
                    className="bg-black/40 text-white border-white/20"
                    placeholder="Music Awards"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {about.achievements.length === 0 && (
            <p className="text-sm text-white/50 text-center py-4">No achievements added yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Awards</CardTitle>
              <CardDescription className="text-white/60">Awards and recognitions received</CardDescription>
            </div>
            <Button onClick={addAward} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Award
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {about.awards.map((award, index) => (
            <Card key={index} className="bg-black/60 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/50">Award {index + 1}</span>
                  <Button
                    onClick={() => removeAward(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Title</label>
                  <Input
                    value={award.title}
                    onChange={(e) => updateAward(index, { title: e.target.value })}
                    className="bg-black/40 text-white border-white/20"
                    placeholder="Platinum Certification"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Description</label>
                  <Textarea
                    value={award.description}
                    rows={2}
                    onChange={(e) => updateAward(index, { description: e.target.value })}
                    className="bg-black/40 text-white placeholder:text-white/40 border-white/20"
                    placeholder="Latest Album - 1M+ Streams"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {about.awards.length === 0 && (
            <p className="text-sm text-white/50 text-center py-4">No awards added yet.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-black/40 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Contact Information</CardTitle>
            <CardDescription className="text-white/60">Contact details displayed on the About page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Location</label>
              <Input
                value={about.location}
                onChange={(e) => updateAbout({ location: e.target.value })}
                className="bg-black/40 text-white border-white/20"
                placeholder="Kigali, Rwanda"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <Input
                type="email"
                value={about.email}
                onChange={(e) => updateAbout({ email: e.target.value })}
                className="bg-black/40 text-white border-white/20"
                placeholder="contact@nelngabo.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Phone</label>
              <Input
                value={about.phone}
                onChange={(e) => updateAbout({ phone: e.target.value })}
                className="bg-black/40 text-white border-white/20"
                placeholder="+250 788 123 456"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Additional Information</CardTitle>
            <CardDescription className="text-white/60">Music label and artist image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Music Label</label>
              <Input
                value={about.musicLabel}
                onChange={(e) => updateAbout({ musicLabel: e.target.value })}
                className="bg-black/40 text-white border-white/20"
                placeholder="Independent Label"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Artist Image URL</label>
              <Input
                value={about.artistImage}
                onChange={(e) => updateAbout({ artistImage: e.target.value })}
                className="bg-black/40 text-white border-white/20"
                placeholder="/hero.jpeg or full URL"
              />
              <label className="text-sm text-white/50">Or upload from computer</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    // Check file size (limit to 2MB to avoid MongoDB document size issues)
                    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
                    if (file.size > maxSizeBytes) {
                      toast.error("Image too large", {
                        description: `Image size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum of 2MB. Please compress the image or use an image hosting service and paste the URL instead.`,
                      });
                      event.target.value = '';
                      return;
                    }
                    const dataUrl = await readFileAsDataUrl(file);
                    // Check the base64 size as well
                    if (dataUrl.length > 3 * 1024 * 1024) { // ~3MB base64 limit
                      toast.error("Image too large", {
                        description: "The image is too large after encoding. Please use a smaller image or upload to an image hosting service.",
                      });
                      event.target.value = '';
                      return;
                    }
                    updateAbout({ artistImage: dataUrl });
                    // Reset input to allow uploading same file again
                    event.target.value = '';
                    toast.success("Image loaded", {
                      description: "Click 'Save Changes' to update the artist image.",
                    });
                  } catch (error) {
                    console.error("Error reading file:", error);
                    toast.error("Failed to load image", {
                      description: error instanceof Error ? error.message : "Could not read the selected file.",
                    });
                    event.target.value = '';
                  }
                }}
                className="w-full text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:text-black file:font-medium hover:file:bg-white/90 cursor-pointer"
              />
            </div>
            {about.artistImage && (
              <div className="mt-4">
                <img
                  src={about.artistImage}
                  alt="Artist preview"
                  className="w-full h-48 object-cover rounded-lg border border-white/10"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const AudiosEditor = ({
  content,
  setContent,
  refreshContent,
}: {
  content: ContentState;
  setContent: ContentSetter;
  refreshContent: () => Promise<void>;
}) => {
  const { audios } = content;
  const [savingAudioId, setSavingAudioId] = useState<string | null>(null);
  const [deletingAudioId, setDeletingAudioId] = useState<string | null>(null);

  const updateAudio = (audioId: string, patch: Partial<ContentState["audios"][number]>) => {
    setContent((prev) => ({
      ...prev,
      audios: prev.audios.map((audio) => (audio.id === audioId ? { ...audio, ...patch } : audio)),
    }));
  };

  const addAudio = async () => {
    const placeholder = {
      image: "/Album.jpeg",
      link: "https://",
      title: "",
    };
    try {
      const response = await adminApi.createAudio(placeholder);
      console.log("Audio created successfully:", response);
      toast.success("Audio created successfully!", {
        description: "A new audio item has been added. You can now edit it.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to create audio", error);
      toast.error("Failed to create audio", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleSaveAudio = async (audioId: string) => {
    const audio = audios.find((item) => item.id === audioId);
    if (!audio) {
      console.error("Audio not found in state:", audioId);
      toast.error("Audio not found", {
        description: "The audio could not be found. Please refresh the page.",
      });
      return;
    }
    
    setSavingAudioId(audioId);
    try {
      const payload = {
        image: audio.image || "/Album.jpeg",
        link: audio.link || "https://",
        title: audio.title || "",
      };
      
      console.log("Saving audio:", { audioId, payload });
      
      const response = await adminApi.updateAudio(audioId, payload);
      console.log("Audio saved successfully:", response);
      toast.success("Audio saved successfully!", {
        description: audio.title ? `"${audio.title}" has been saved.` : "Audio has been saved to the database.",
      });
      await refreshContent();
    } catch (error) {
      console.error("Failed to save audio", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : "Unknown error";
        
      toast.error("Failed to save audio", {
        description: errorMessage,
      });
    } finally {
      setSavingAudioId(null);
    }
  };

  const removeAudio = async (audioId: string) => {
    const audio = audios.find((item) => item.id === audioId);
    if (!audio) return;
    
    if (!confirm(`Are you sure you want to delete this audio? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingAudioId(audioId);
    try {
      await adminApi.deleteAudio(audioId);
      await refreshContent();
      console.log("Audio deleted successfully");
      toast.success("Audio deleted successfully!", {
        description: "Audio has been removed from the database.",
      });
    } catch (error) {
      console.error("Failed to delete audio", error);
      toast.error("Failed to delete audio", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setDeletingAudioId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 mb-1">Audio Management</p>
          <h3 className="text-xl font-semibold text-white">Audio Items</h3>
        </div>
        <Button onClick={addAudio} variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Add Audio
        </Button>
      </div>

      {!audios.length && (
        <Card className="border-white/10 bg-black/40">
          <CardContent className="pt-6">
            <p className="text-center text-white/60">
              No audio items yet. Click "Add Audio" to create one.
            </p>
          </CardContent>
        </Card>
      )}

      {audios.map((audio) => (
        <Card key={audio.id} className="border-white/10 bg-black/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {audio.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={audio.image}
                      alt={audio.title || "Audio"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/Album.jpeg";
                      }}
                    />
                  </div>
                )}
                <div>
                  <CardTitle className="text-white">{audio.title || "Untitled Audio"}</CardTitle>
                  <CardDescription className="text-white/60">{audio.link || "No link"}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSaveAudio(audio.id)}
                  disabled={savingAudioId === audio.id}
                >
                  {savingAudioId === audio.id ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAudio(audio.id)}
                  disabled={deletingAudioId === audio.id}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deletingAudioId === audio.id ? "Removing..." : "Delete"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Title (Optional)</label>
              <Input 
                value={audio.title} 
                onChange={(event) => updateAudio(audio.id, { title: event.target.value })} 
                placeholder="Audio title"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Link</label>
              <Input 
                value={audio.link} 
                onChange={(event) => updateAudio(audio.id, { link: event.target.value })} 
                placeholder="https://"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20" 
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-white">Image URL</label>
              <Input 
                value={audio.image} 
                onChange={(event) => updateAudio(audio.id, { image: event.target.value })} 
                placeholder="Image URL"
                className="bg-black/40 text-white placeholder:text-white/40 border-white/20" 
              />
              {audio.image && (
                <div className="mt-2">
                  <img
                    src={audio.image}
                    alt="Audio preview"
                    className="w-full h-48 object-cover rounded-lg border border-white/10"
                    onError={(e) => {
                      console.error("Failed to load audio image:", audio.image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <label className="text-sm text-white/50">Or upload from computer</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
                    if (file.size > maxSizeBytes) {
                      toast.error("Image too large", {
                        description: `Image size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum of 2MB. Please compress the image or use an image hosting service and paste the URL instead.`,
                      });
                      event.target.value = '';
                      return;
                    }
                    const dataUrl = await readFileAsDataUrl(file);
                    if (dataUrl.length > 3 * 1024 * 1024) {
                      toast.error("Image too large", {
                        description: "The image is too large after encoding. Please use a smaller image or upload to an image hosting service.",
                      });
                      event.target.value = '';
                      return;
                    }
                    updateAudio(audio.id, { image: dataUrl });
                    event.target.value = '';
                    toast.success("Image loaded", {
                      description: "Click 'Save' to update the audio image.",
                    });
                  } catch (error) {
                    console.error("Error reading file:", error);
                    toast.error("Failed to load image", {
                      description: error instanceof Error ? error.message : "Could not read the selected file.",
                    });
                    event.target.value = '';
                  }
                }}
                className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};



