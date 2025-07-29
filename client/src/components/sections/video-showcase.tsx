import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import VideoPlayer from "@/components/ui/video-player";

export default function VideoShowcase() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const videos = [
    {
      id: "9GhY_DUBEGY",
      title: "Luxury Real Estate Showcase",
      description: "How we get you more views on your listing",
      thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      id: "mPczwu1pnD8",
      title: "Bjork Group", 
      description: "Discover our market knowledge and professional approach to real estate",
      thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80"
    },
    {
      id: "fbcu6KBTXcI",
      title: "Client Success Stories",
      description: "Real testimonials and success stories from our satisfied clients",
      thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const currentVideo = videos[currentVideoIndex];

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(false);
  };

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

        <div className="max-w-4xl mx-auto relative">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
            {!isPlaying ? (
              <>
                <img 
                  src={currentVideo.thumbnail}
                  alt={currentVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-bjork-black/30 flex items-center justify-center">
                  <Button 
                    onClick={() => setIsPlaying(true)}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-6 hover:bg-white transition-colors duration-300 group"
                    size="lg"
                  >
                    <Play className="w-12 h-12 text-bjork-black group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                  </Button>
                </div>
              </>
            ) : (
              <VideoPlayer 
                videoId={currentVideo.id}
                onClose={() => setIsPlaying(false)}
              />
            )}
          </div>

          {/* Navigation Arrows */}
          {videos.length > 1 && (
            <>
              <Button
                onClick={prevVideo}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors duration-300 shadow-lg"
                size="sm"
              >
                <ChevronLeft className="w-6 h-6 text-bjork-black" />
              </Button>
              
              <Button
                onClick={nextVideo}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors duration-300 shadow-lg"
                size="sm"
              >
                <ChevronRight className="w-6 h-6 text-bjork-black" />
              </Button>
            </>
          )}

          {/* Video Info */}
          <div className="text-center mt-8">
            <h3 className="text-2xl font-medium text-white mb-2">{currentVideo.title}</h3>
            <p className="text-white/80 text-sm mb-4">{currentVideo.description}</p>
            
            {/* Video Indicators */}
            {videos.length > 1 && (
              <div className="flex justify-center space-x-2">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentVideoIndex(index);
                      setIsPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentVideoIndex ? 'bg-bjork-beige' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
