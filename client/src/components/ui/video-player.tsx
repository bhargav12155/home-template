import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  onClose: () => void;
  autoplay?: boolean;
}

export default function VideoPlayer({ videoId, onClose, autoplay = true }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${autoplay ? 'autoplay=1&' : ''}rel=0&modestbranding=1&showinfo=0`;

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
        size="icon"
      >
        <X className="w-4 h-4" />
      </Button>
      
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="YouTube video player"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
