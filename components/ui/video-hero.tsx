"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface VideoHeroProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

export function VideoHero({
  videoUrl,
  posterUrl,
  title,
  subtitle,
  autoplay = false,
  muted = true,
  loop = true,
  className,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);

  // Use animated background instead of video for better performance
  const defaultPoster =
    posterUrl ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop&q=80";

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoUrl]);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, videoUrl]);

  return (
    <div
      className={cn(
        "relative w-full h-[600px] overflow-hidden rounded-2xl shadow-2xl group",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video or Animated Background */}
      {videoUrl ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={defaultPoster}
          loop={loop}
          muted={isMuted}
          playsInline
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div
          className="w-full h-full bg-gradient-to-br from-blue-600 via-cyan-600 to-sky-600 relative overflow-hidden"
          style={{
            backgroundImage: `url(${defaultPoster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 via-cyan-600/70 to-sky-600/70" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      {(title || subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-8 text-center">
          {title && (
            <h2 className="text-5xl font-bold mb-4 animate-fade-in-up drop-shadow-2xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-white/90 max-w-2xl animate-fade-in-up drop-shadow-lg" style={{ animationDelay: "0.2s" }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="text-white hover:bg-white/20"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}


