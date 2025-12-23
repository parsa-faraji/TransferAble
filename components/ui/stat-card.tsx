"use client";

import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "purple" | "orange";
  animated?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "blue",
  animated = true,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isNumber = typeof value === "number";

  useEffect(() => {
    if (animated && isNumber) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value as number);
    }
  }, [value, animated, isNumber]);

  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity",
          colorClasses[color]
        )}
      />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && (
          <div className={cn("p-2 rounded-lg bg-gradient-to-br", colorClasses[color], "opacity-10 group-hover:opacity-20 transition-opacity")}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <div className={cn("text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent", colorClasses[color])}>
              {isNumber ? displayValue : value}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {trend && trendValue && (
            <div
              className={cn(
                "flex items-center text-sm font-medium",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-gray-600"
              )}
            >
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}








