"use client";

import { useState } from "react";
import { Sparkles, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MascotProps {
  message?: string;
  mood?: "happy" | "excited" | "encouraging" | "celebrating" | "thinking";
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
  animated?: boolean;
}

export function Mascot({
  message,
  mood = "happy",
  size = "md",
  showName = true,
  className = "",
  animated = true,
}: MascotProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: { scale: 0.6, message: "text-xs", name: "text-xs" },
    md: { scale: 1, message: "text-sm", name: "text-sm" },
    lg: { scale: 1.4, message: "text-base", name: "text-base" },
  };

  const config = sizes[size];

  // Different eye expressions for moods
  const getEyeExpression = () => {
    switch (mood) {
      case "excited":
        return { leftX: 55, leftY: 52, rightX: 85, rightY: 52, pupilSize: 4 };
      case "thinking":
        return { leftX: 53, leftY: 51, rightX: 83, rightY: 51, pupilSize: 3.5 };
      case "celebrating":
        return { leftX: 55, leftY: 50, rightX: 85, rightY: 50, pupilSize: 4.5 };
      case "encouraging":
        return { leftX: 55, leftY: 52, rightX: 85, rightY: 52, pupilSize: 3.8 };
      default:
        return { leftX: 55, leftY: 52, rightX: 85, rightY: 52, pupilSize: 4 };
    }
  };

  const eyes = getEyeExpression();

  return (
    <div className={cn("relative flex flex-col items-center gap-3", className)}>
      {/* Owl Character */}
      <div
        className="relative cursor-pointer"
        style={{ transform: `scale(${config.scale})` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          width="140"
          height="150"
          viewBox="0 0 140 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "transition-all duration-300",
            animated && "animate-bounce-slow",
            isHovered && "scale-110"
          )}
        >
          {/* Glow effect */}
          <circle cx="70" cy="75" r="65" fill="url(#glow)" opacity="0.4" />

          {/* Main body group - tilted slightly */}
          <g transform="rotate(-5 70 80)">
            {/* Body with gradient - more upright */}
            <ellipse cx="70" cy="90" rx="28" ry="35" fill="url(#bodyGradient)" />

            {/* Belly with pattern */}
            <ellipse cx="70" cy="95" rx="20" ry="26" fill="url(#bellyGradient)" />
            <circle cx="70" cy="88" r="2.5" fill="white" opacity="0.3" />
            <circle cx="66" cy="95" r="2" fill="white" opacity="0.3" />
            <circle cx="74" cy="95" r="2" fill="white" opacity="0.3" />
            <circle cx="70" cy="102" r="1.8" fill="white" opacity="0.3" />
          </g>

          {/* Wings - one raised, one lowered for dynamic pose */}
          <g className={isHovered ? "animate-pulse" : ""}>
            {/* Left wing - raised like waving */}
            <path d="M 35 70 Q 20 60 15 68 Q 12 78 20 85 Q 28 80 35 78 Z" fill="url(#wingGradient)" />
            <path d="M 32 72 Q 24 65 19 71" stroke="#6D28D9" strokeWidth="1" opacity="0.5" fill="none" />
            <path d="M 30 77 Q 22 72 17 78" stroke="#6D28D9" strokeWidth="1" opacity="0.5" fill="none" />

            {/* Right wing - slightly down */}
            <path d="M 105 78 Q 118 75 123 85 Q 125 95 118 100 Q 110 93 105 88 Z" fill="url(#wingGradient)" />
            <path d="M 108 82 Q 115 79 120 86" stroke="#6D28D9" strokeWidth="1" opacity="0.5" fill="none" />
            <path d="M 110 88 Q 117 85 122 92" stroke="#6D28D9" strokeWidth="1" opacity="0.5" fill="none" />
          </g>

          {/* Head - tilted to the side for charm */}
          <g transform="rotate(-8 70 50)">
            <circle cx="70" cy="50" r="32" fill="url(#headGradient)" />

            {/* Ear tufts - more prominent and expressive */}
            <path d="M 45 22 Q 40 14 43 10 Q 46 14 48 20" fill="#7C3AED" />
            <path d="M 95 24 Q 100 16 97 12 Q 94 16 92 22" fill="#7C3AED" />

            {/* Eye sockets for depth */}
            <ellipse cx="57" cy="48" rx="13" ry="15" fill="#F3F4F6" />
            <ellipse cx="83" cy="48" rx="13" ry="15" fill="#F3F4F6" />

            {/* Eyes - larger and more expressive */}
            <circle cx="57" cy="48" r="11" fill="white" />
            <circle cx="83" cy="48" r="11" fill="white" />

            {/* Eye outlines */}
            <circle cx="57" cy="48" r="11" stroke="#E5E7EB" strokeWidth="1" fill="none" />
            <circle cx="83" cy="48" r="11" stroke="#E5E7EB" strokeWidth="1" fill="none" />

            {/* Pupils - animated */}
            <circle
              cx="57"
              cy="48"
              r={eyes.pupilSize}
              fill="#1F2937"
              className="transition-all duration-300"
            >
              {animated && <animate attributeName="cy" values="48;49;48" dur="3s" repeatCount="indefinite" />}
            </circle>
            <circle
              cx="83"
              cy="48"
              r={eyes.pupilSize}
              fill="#1F2937"
              className="transition-all duration-300"
            >
              {animated && <animate attributeName="cy" values="48;49;48" dur="3s" repeatCount="indefinite" />}
            </circle>

            {/* Eye shine - bigger and more lively */}
            <circle cx="59" cy="45" r="3" fill="white" opacity="0.9" />
            <circle cx="85" cy="45" r="3" fill="white" opacity="0.9" />
            <circle cx="56" cy="50" r="1.5" fill="white" opacity="0.6" />
            <circle cx="82" cy="50" r="1.5" fill="white" opacity="0.6" />

            {/* Eyebrows for expression */}
            {mood === "excited" && (
              <>
                <path d="M 48 40 Q 52 36 62 38" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 92 40 Q 88 36 78 38" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </>
            )}

            {/* Beak - more detailed with happy curve */}
            <path d="M 70 56 L 65 64 L 70 66 L 75 64 Z" fill="url(#beakGradient)" />
            <path d="M 70 56 L 70 66" stroke="#D97706" strokeWidth="1" opacity="0.5" />

            {/* Small smile line */}
            <path d="M 65 66 Q 70 68 75 66" stroke="#D97706" strokeWidth="0.8" opacity="0.6" fill="none" strokeLinecap="round" />

            {/* Cheek blush for cuteness */}
            <ellipse cx="42" cy="56" rx="6" ry="4" fill="#FCA5A5" opacity="0.5" />
            <ellipse cx="98" cy="56" rx="6" ry="4" fill="#FCA5A5" opacity="0.5" />
          </g>

          {/* Graduation cap - tilted with head */}
          <g transform="rotate(-8 70 50) translate(70, 22)">
            {/* Cap base */}
            <ellipse cx="0" cy="-2" rx="8" ry="8" fill="#1F2937" />
            <ellipse cx="0" cy="-3" rx="8" ry="3" fill="#374151" />

            {/* Cap board */}
            <rect x="-22" y="-6" width="44" height="3" fill="#1F2937" rx="1" />
            <rect x="-22" y="-6" width="44" height="1.5" fill="#374151" rx="1" />

            {/* Tassel cord - swinging */}
            <line x1="18" y1="-4" x2="22" y2="4" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />

            {/* Tassel */}
            <circle cx="22" cy="4" r="3" fill="#FCD34D" />
            <circle cx="22" cy="4" r="2" fill="#FDE047" />
            <path d="M 20 6 L 20 9 M 22 6 L 22 10 M 24 6 L 24 9" stroke="#F59E0B" strokeWidth="0.5" />
          </g>

          {/* Feet - positioned for standing pose */}
          <g transform="rotate(-5 70 80)">
            <g transform="translate(58, 120)">
              <ellipse cx="0" cy="0" rx="5" ry="3" fill="#F59E0B" />
              <path d="M -3 2 L -5 6 M 0 2 L 0 7 M 3 2 L 5 6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g transform="translate(82, 120)">
              <ellipse cx="0" cy="0" rx="5" ry="3" fill="#F59E0B" />
              <path d="M -3 2 L -5 6 M 0 2 L 0 7 M 3 2 L 5 6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>

          {/* Gradients */}
          <defs>
            <radialGradient id="glow">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>

            <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>

            <linearGradient id="bellyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DDD6FE" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>

            <linearGradient id="wingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>

            <linearGradient id="beakGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating sparkles */}
        {animated && (
          <>
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
            <Star className="absolute -bottom-2 -left-2 w-4 h-4 text-purple-400 animate-spin-slow" />
          </>
        )}

        {/* Floating hearts on hover */}
        {isHovered && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-float-up">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          </div>
        )}
      </div>

      {/* Name */}
      {showName && (
        <div className={cn("font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent", config.name)}>
          Hootie
        </div>
      )}

      {/* Message Bubble */}
      {message && (
        <div className="relative max-w-xs">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-4 border border-purple-100/50 relative">
            {/* Speech bubble pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 border-t border-l border-purple-100/50 rotate-45"></div>
            <p className={cn("text-gray-700 text-center", config.message)}>
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Preset mascot messages for different contexts
export const MascotMessages = {
  welcome: "Ready to start your transfer journey? I'm here to help guide you every step of the way.",
  encouragement: "You're doing amazing. Keep up the great work and stay focused on your goals.",
  celebration: "Congratulations on your progress. You're one step closer to your dream school.",
  coursePlanning: "Let's plan your courses together. I'll help you stay on track with requirements.",
  deadlineReminder: "Don't forget about your upcoming deadlines. I've got your back with timely reminders.",
  mentorConnection: "Connect with mentors who've been in your shoes. They're here to share their experience.",
  applicationTime: "Time to work on those applications. You've prepared well and you're ready.",
  motivational: "Every step you take brings you closer to your goals. Keep pushing forward.",
  celebration2: "Your hard work is paying off. Stay committed to the path you've chosen.",
  tips: "Pro tip: Stay organized and don't be afraid to ask for help when you need it.",
};
