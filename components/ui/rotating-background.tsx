"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import NextImage from "next/image";

const universityImages = [
  {
    url: "/UC Berkeley.jpeg",
    name: "UC Berkeley",
    credit: "Official Photo",
  },
  {
    url: "/Stanford.jpeg",
    name: "Stanford University",
    credit: "Official Photo",
  },
  {
    url: "/UCLA.jpeg",
    name: "UCLA",
    credit: "Official Photo",
  },
  {
    url: "/UC San Diego.jpeg",
    name: "UC San Diego",
    credit: "Official Photo",
  },
  {
    url: "/UC Davis.jpeg",
    name: "UC Davis",
    credit: "Official Photo",
  },
  {
    url: "/UC Santa Barbara.jpeg",
    name: "UC Santa Barbara",
    credit: "Official Photo",
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
    <div className="absolute inset-0 overflow-hidden -z-10">
      {universityImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-2000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <NextImage
            src={image.url}
            alt={image.name}
            fill
            className="object-cover"
            style={{
              filter: "brightness(0.5) saturate(1.1)",
            }}
            priority={index === 0}
            quality={90}
            unoptimized={false}
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

