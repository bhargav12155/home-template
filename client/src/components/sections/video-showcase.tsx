import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import VideoPlayer from "@/components/ui/video-player";

export default function VideoShowcase() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const videos = [
    {
      id: "9GhY_DUBEGY",
      title: "Luxury Real Estate Showcase",
      description: "Experience our premium property presentations and client success stories",
      thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      id: "mPczwu1pnD8",
      title: "Market Insights & Expertise", 
      description: "Discover our market knowledge and professional approach to real estate",
      thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80"
    }
  ];

  return (
    <section className="py-20 bg-bjork-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-light text-white mb-6">
            Experience <span className="text-bjork-beige">Luxury</span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Watch how we create extraordinary real estate experiences for our clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="group">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl mb-4">
                {playingVideo !== video.id ? (
                  <>
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-bjork-black/30 group-hover:bg-bjork-black/20 flex items-center justify-center transition-colors duration-300">
                      <Button 
                        onClick={() => setPlayingVideo(video.id)}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors duration-300 group/btn"
                        size="lg"
                      >
                        <Play className="w-8 h-8 text-bjork-black group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <VideoPlayer 
                    videoId={video.id}
                    onClose={() => setPlayingVideo(null)}
                  />
                )}
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-medium text-white mb-2">{video.title}</h3>
                <p className="text-white/80 text-sm">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
