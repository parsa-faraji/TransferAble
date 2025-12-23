"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import Image from "next/image";

interface SuccessStoryProps {
  name: string;
  from: string;
  to: string;
  major: string;
  quote: string;
  image?: string;
  delay?: number;
}

export function SuccessStory({
  name,
  from,
  to,
  major,
  quote,
  image,
  delay = 0,
}: SuccessStoryProps) {
  return (
    <Card
      className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-purple-300 relative overflow-hidden group"
      style={{
        animation: `fade-in-up 0.6s ease-out ${delay}ms both`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {image ? (
              <div className="relative w-16 h-16">
                <Image
                  src={image}
                  alt={name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border-4 border-white shadow-lg group-hover:border-purple-200 transition-colors"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Quote className="h-5 w-5 text-purple-400 mr-2" />
              <p className="text-gray-700 italic">{quote}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="font-semibold text-gray-900">Transfer Student</div>
              <div className="text-sm text-gray-600">
                {from} → {to}
              </div>
              <div className="text-xs text-purple-600 font-medium mt-1">{major}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}








