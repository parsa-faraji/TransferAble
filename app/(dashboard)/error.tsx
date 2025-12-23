"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <Card className="max-w-lg w-full shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
              <CardDescription className="mt-1">
                We encountered an error while loading this page.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error.message && (
              <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg">
                <p className="text-sm text-red-800 font-mono break-all">{error.message}</p>
              </div>
            )}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
              <p className="text-sm text-blue-900">
                <strong>What you can do:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
                <li>Try refreshing the page</li>
                <li>Go back to the dashboard</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={reset} className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" asChild className="flex-1 gap-2">
                <Link href="/dashboard">
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
