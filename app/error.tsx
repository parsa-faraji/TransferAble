"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <CardTitle>Something went wrong!</CardTitle>
          </div>
          <CardDescription>
            We encountered an unexpected error. Don't worry, your data is safe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error.message && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-mono">{error.message}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={reset} className="flex-1">
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/"} className="flex-1">
                Go home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
