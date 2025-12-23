import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, MessageSquare, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommunityPage() {
  const topics = [
    {
      title: "UC Berkeley Transfers",
      description: "Connect with students transferring to UC Berkeley"
    },
    {
      title: "UCLA Transfers",
      description: "Share experiences and advice for UCLA transfers"
    },
    {
      title: "CS/Engineering Transfers",
      description: "Computer Science and Engineering transfer discussions"
    },
    {
      title: "Pre-Med Transfers",
      description: "Pre-medical track transfer student community"
    },
    {
      title: "Application Help",
      description: "Get help with your UC/CSU applications"
    },
    {
      title: "General Discussion",
      description: "General transfer questions and discussions"
    }
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Forum</h1>
          <p className="text-xl text-gray-600">
            Connect with fellow transfer students, share experiences, and get advice
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topics.map((topic, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" className="w-full">
                  Join Discussion
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Popular Discussions</CardTitle>
            <CardDescription>Most active conversations in the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "How I got into UC Berkeley CS", author: "Sarah C.", replies: 24, views: 156 },
                { title: "Best GE courses for transfer", author: "Mike R.", replies: 18, views: 98 },
                { title: "PIQ writing tips that worked", author: "Emily P.", replies: 31, views: 203 }
              ].map((post, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500">by {post.author}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{post.replies} replies</span>
                    <span>{post.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

