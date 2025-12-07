"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const universityImages = [
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/UC_Berkeley_campus_aerial_view.jpg/2560px-UC_Berkeley_campus_aerial_view.jpg",
    name: "UC Berkeley",
    credit: "Wikimedia Commons",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Stanford_University_campus_%28aerial_view%29.jpg/2560px-Stanford_University_campus_%28aerial_view%29.jpg",
    name: "Stanford University",
    credit: "Wikimedia Commons",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/UCLA_Royce_Hall.jpg/2560px-UCLA_Royce_Hall.jpg",
    name: "UCLA",
    credit: "Wikimedia Commons",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/UC_San_Diego_Geisel_Library.jpg/2560px-UC_San_Diego_Geisel_Library.jpg",
    name: "UC San Diego",
    credit: "Wikimedia Commons",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/USC_Campus_Aerial_View.jpg/2560px-USC_Campus_Aerial_View.jpg",
    name: "USC",
    credit: "Wikimedia Commons",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/UC_Santa_Barbara_campus.jpg/2560px-UC_Santa_Barbara_campus.jpg",
    name: "UC Santa Barbara",
    credit: "Wikimedia Commons",
  },
];

export function RotatingBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Preload all images
    universityImages.forEach((img, index) => {
      const image = new Image();
      image.src = img.url;
      image.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };
    });

    // Rotate every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % universityImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {universityImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-2000 ease-in-out",
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
          )}
        >
          <img
            src={image.url}
            alt={image.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: "brightness(0.5) saturate(1.1)",
            }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-cyan-900/40" />
        </div>
      ))}
      {/* Attribution */}
      <div className="absolute bottom-4 right-4 z-10 text-white/80 text-xs bg-black/40 px-3 py-1 rounded backdrop-blur-sm">
        <p>
          {universityImages[currentIndex].name} via {universityImages[currentIndex].credit}
        </p>
      </div>
    </div>
  );
}

