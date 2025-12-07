"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function AnimatedCard({
  children,
  className,
  hover = true,
  delay = 0,
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        "opacity-0 translate-y-4 animate-fade-in-up",
        hover && "hover:scale-[1.02] hover:shadow-xl cursor-pointer",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "transition-all duration-300",
          isHovered && hover && "border-purple-300 shadow-lg"
        )}
      >
        {children}
      </Card>
    </div>
  );
}






