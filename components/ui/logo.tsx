"use client";

import { GraduationCap, TrendingUp } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: {
      container: "h-8 w-8",
      icon: "h-4 w-4",
      text: "text-base",
    },
    md: {
      container: "h-10 w-10",
      icon: "h-5 w-5",
      text: "text-lg",
    },
    lg: {
      container: "h-12 w-12",
      icon: "h-6 w-6",
      text: "text-xl",
    },
  };

  const sizeClasses = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <div className={`${sizeClasses.container} rounded-xl bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 flex items-center justify-center shadow-lg relative overflow-hidden group`}>
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Icons */}
          <div className="relative z-10 flex items-center justify-center">
            <GraduationCap className={`${sizeClasses.icon} text-white transform -rotate-12`} />
            <TrendingUp className={`${sizeClasses.icon} text-yellow-300 absolute transform translate-x-1 -translate-y-0.5`} />
          </div>
        </div>

        {/* Sparkle effect */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizeClasses.text} font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}>
            TransferAble
          </span>
        </div>
      )}
    </div>
  );
}
