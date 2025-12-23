"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: "primary" | "success" | "warning" | "danger";
  animated?: boolean;
}

export function AnimatedProgress({
  value,
  max = 100,
  className,
  showLabel = true,
  color = "primary",
  animated = true,
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const duration = 1500;
      const steps = 60;
      const increment = percentage / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          setDisplayValue(percentage);
          clearInterval(timer);
        } else {
          setDisplayValue(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  const colorClasses = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
    danger: "bg-gradient-to-r from-red-500 to-pink-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">
            {Math.round(displayValue)}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
            colorClasses[color]
          )}
          style={{ width: `${displayValue}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}








