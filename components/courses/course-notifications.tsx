"use client";

import { AlertCircle, CheckCircle2, Clock, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Notification {
  type: "availability" | "conflict" | "prerequisite" | "competitiveness" | "info";
  course: string;
  message: string;
  priority: "high" | "medium" | "low";
}

interface CourseNotificationsProps {
  notifications: Notification[];
}

export function CourseNotifications({ notifications }: CourseNotificationsProps) {
  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "availability":
        return <Clock className="h-5 w-5" />;
      case "conflict":
        return <AlertTriangle className="h-5 w-5" />;
      case "prerequisite":
        return <AlertCircle className="h-5 w-5" />;
      case "competitiveness":
        return <Info className="h-5 w-5" />;
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const getColor = (priority: string, type: string) => {
    if (priority === "high" || type === "conflict") {
      return "border-red-200 bg-red-50 text-red-800";
    }
    if (priority === "medium" || type === "prerequisite") {
      return "border-orange-200 bg-orange-50 text-orange-800";
    }
    return "border-blue-200 bg-blue-50 text-blue-800";
  };

  const sortedNotifications = notifications.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Course Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedNotifications.map((notification, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border-2 flex items-start gap-3 transition-all hover:shadow-md",
                getColor(notification.priority, notification.type)
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">{notification.course}</div>
                <div className="text-sm">{notification.message}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
