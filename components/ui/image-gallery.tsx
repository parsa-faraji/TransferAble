"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  title?: string;
  className?: string;
}

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  if (images.length === 0) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedIndex(index)}
          >
            {failedImages[index] ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center text-white text-sm font-semibold">
                {title || "Gallery"} {index + 1}
              </div>
            ) : (
              <Image
                src={image}
                alt={`${title || "Gallery"} image ${index + 1}`}
                fill
                className="object-cover group-hover:brightness-110 transition-all duration-300"
                loading="lazy"
                onError={() =>
                  setFailedImages((prev) => ({
                    ...prev,
                    [index]: true,
                  }))
                }
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <button
            className="absolute left-4 text-white hover:text-gray-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(
                selectedIndex > 0 ? selectedIndex - 1 : images.length - 1
              );
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          {failedImages[selectedIndex] ? (
            <div className="max-w-full max-h-full w-[80vw] h-[60vh] bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center text-white text-lg font-semibold rounded-xl">
              {title || "Gallery"} {selectedIndex + 1}
            </div>
          ) : (
            <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[selectedIndex]}
                alt={`${title || "Gallery"} image ${selectedIndex + 1}`}
                fill
                className="object-contain"
                onError={() =>
                  setFailedImages((prev) => ({
                    ...prev,
                    [selectedIndex]: true,
                  }))
                }
              />
            </div>
          )}
          <button
            className="absolute right-4 text-white hover:text-gray-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(
                selectedIndex < images.length - 1 ? selectedIndex + 1 : 0
              );
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </>
  );
}




