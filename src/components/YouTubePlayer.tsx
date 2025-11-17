import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type YouTubePlayerProps = {
  videoId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

const YouTubePlayer = ({ videoId, title, isOpen, onClose }: YouTubePlayerProps) => {
  // Use a simpler embed URL for video player (with controls and autoplay)
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black border-white/20">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="aspect-video w-full">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Invalid video ID
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubePlayer;

