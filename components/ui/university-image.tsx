"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

interface UniversityImageProps {
  name: string;
  code?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: boolean;
  animated?: boolean;
}

// Real campus images using local photos
const universityImages: Record<string, string> = {
  "UC Berkeley": "/UC Berkeley.jpeg",
  "UCLA": "/UCLA.jpeg",
  "UC San Diego": "/UC San Diego.jpeg",
  "UC Santa Barbara": "/UC Santa Barbara.jpeg",
  "UC Davis": "/UC Davis.jpeg",
  "Stanford": "/Stanford.jpeg",
};

// Fallback gradient colors
const universityColors: Record<string, { from: string; to: string; via?: string }> = {
  "UC Berkeley": { from: "from-blue-600", to: "to-yellow-500", via: "via-blue-500" },
  "UCLA": { from: "from-blue-700", to: "to-yellow-400", via: "via-blue-600" },
  "UC San Diego": { from: "from-blue-500", to: "to-yellow-400", via: "via-cyan-500" },
  "UC Santa Barbara": { from: "from-blue-600", to: "to-cyan-500", via: "via-blue-500" },
  "UC Davis": { from: "from-blue-700", to: "to-yellow-500", via: "via-blue-600" },
  "UC Irvine": { from: "from-blue-600", to: "to-yellow-400", via: "via-blue-500" },
  "UC Santa Cruz": { from: "from-blue-700", to: "to-yellow-500", via: "via-blue-600" },
  "UC Riverside": { from: "from-blue-700", to: "to-yellow-500", via: "via-blue-600" },
  "UC Merced": { from: "from-blue-700", to: "to-yellow-500", via: "via-blue-600" },
  "Stanford": { from: "from-red-700", to: "to-red-900", via: "via-red-800" },
  "USC": { from: "from-red-700", to: "to-yellow-500", via: "via-red-600" },
  "San Francisco State": { from: "from-purple-700", to: "to-yellow-500", via: "via-purple-600" },
  "San Jose State": { from: "from-blue-700", to: "to-yellow-400", via: "via-blue-600" },
  "Cal Poly SLO": { from: "from-green-700", to: "to-yellow-500", via: "via-green-600" },
};

export function UniversityImage({
  name,
  code,
  className,
  size = "md",
  rounded = true,
  animated = true,
}: UniversityImageProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  const colors = universityColors[name] || { from: "from-blue-600", to: "to-cyan-500", via: "via-blue-500" };

  // Get initials for the university name
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  const imageUrl = universityImages[name];
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden shadow-md",
        sizeClasses[size],
        rounded && "rounded-lg",
        animated && "group hover:scale-105 transition-transform duration-300 hover:shadow-2xl",
        !imageUrl || imageError ? `bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to}` : "",
        className
      )}
    >
      {imageUrl && !imageError ? (
        <>
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <GraduationCap className="w-1/3 h-1/3 mb-2 drop-shadow-lg" />
            <span className="text-sm font-bold text-center leading-tight drop-shadow-lg">
              {initials}
            </span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <div className="absolute inset-0 bg-black/5" />
          <GraduationCap className="w-1/3 h-1/3 mb-3 opacity-90 drop-shadow-lg relative z-10" />
          <span className="text-lg font-bold text-center leading-tight opacity-95 drop-shadow-lg relative z-10">
            {initials}
          </span>
        </div>
      )}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );
}
