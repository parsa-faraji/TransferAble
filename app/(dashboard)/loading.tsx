import { Loader2, BookOpen, Calendar, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-8 shadow-xl">
          <div className="h-10 bg-white/20 rounded w-3/4 mb-3"></div>
          <div className="h-6 bg-white/20 rounded w-1/2"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[BookOpen, Calendar, Users, Target].map((Icon, i) => (
            <Card key={i} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <Icon className="h-8 w-8 text-gray-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 mt-6"></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-8 right-8 bg-white rounded-full p-4 shadow-lg">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    </div>
  );
}
