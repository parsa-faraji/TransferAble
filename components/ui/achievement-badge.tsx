"use client";

import { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Award, Sparkles } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  earned?: boolean;
  progress?: number;
  color?: "gold" | "silver" | "bronze" | "purple";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function AchievementBadge({
  title,
  description,
  icon,
  earned = false,
  progress = 0,
  color = "purple",
  size = "md",
  animated = true,
}: AchievementBadgeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (earned && animated) {
      setIsVisible(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [earned, animated]);

  const sizeClasses = {
    sm: "w-16 h-16 text-2xl",
    md: "w-24 h-24 text-3xl",
    lg: "w-32 h-32 text-4xl",
  };

  const colorClasses = {
    gold: "from-yellow-400 to-orange-500",
    silver: "from-gray-300 to-gray-400",
    bronze: "from-orange-600 to-red-600",
    purple: "from-purple-500 to-pink-500",
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "relative rounded-full bg-gradient-to-br p-4 shadow-lg transition-all duration-500",
          colorClasses[color],
          sizeClasses[size],
          earned && "animate-pulse-glow",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )}
        style={{
          animation: earned && animated ? "fade-in-up 0.6s ease-out" : undefined,
        }}
      >
        {icon || <Award className="w-full h-full text-white" />}
        {earned && showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-ping" />
          </div>
        )}
      </div>
      {!earned && progress > 0 && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r rounded-full transition-all duration-500",
              colorClasses[color]
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="mt-2 text-center">
        <div className={cn(
          "font-semibold text-sm",
          earned ? "text-gray-900" : "text-gray-500"
        )}>
          {title}
        </div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </div>
  );
}








