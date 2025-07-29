import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import VideoPlayer from "@/components/ui/video-player";

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

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

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
            {!isPlaying ? (
              <>
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                  alt="Modern real estate office interior"
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
                videoId="y0G0GOZfy9Y"
                onClose={() => setIsPlaying(false)}
              />
            )}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-white/80 text-sm">
              Discover our luxury real estate showcase and client success stories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
