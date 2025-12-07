import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TransferAble</span>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">See TransferAble in Action</h1>
          <p className="text-xl text-gray-600">
            Watch how TransferAble helps students plan their transfer journey
          </p>
        </div>

        {/* Demo Video Placeholder */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Product Demo</CardTitle>
            <CardDescription>Interactive walkthrough of TransferAble features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Demo video coming soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Sign up to explore the full platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Smart Course Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                See how our intelligent system tracks your course requirements across multiple universities
                and helps you stay on track.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentor Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Watch how students connect with verified mentors from their target universities
                for personalized guidance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Explore our PIQ essay tools, activity log builder, and application tracking features.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Try TransferAble Free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

