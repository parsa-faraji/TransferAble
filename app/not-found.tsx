import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Mascot } from "@/components/ui/mascot";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <Mascot
            mood="thinking"
            size="lg"
            showName={false}
            animated={true}
          />
        </div>

        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Hoot hoot! Page not found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Looks like this page flew away! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/dashboard">
              <Search className="h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-3">Popular Pages:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/courses" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
              Course Planning
            </Link>
            <Link href="/mentors" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
              Find Mentors
            </Link>
            <Link href="/timeline" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
              Timeline
            </Link>
            <Link href="/resources" className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium">
              Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
