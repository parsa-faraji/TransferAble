import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPage() {
  const posts = [
    {
      id: "1",
      title: "How to Get Into UC Berkeley as a Transfer Student",
      excerpt: "A comprehensive guide to transferring to UC Berkeley, including course requirements, GPA expectations, and application tips.",
      author: "Sarah Chen",
      date: "December 1, 2025",
      category: "Transfer Guides"
    },
    {
      id: "2",
      title: "Top 10 Mistakes Transfer Students Make",
      excerpt: "Learn from common mistakes to avoid pitfalls on your transfer journey and stay on track for success.",
      author: "Michael Rodriguez",
      date: "November 28, 2025",
      category: "Tips & Advice"
    },
    {
      id: "3",
      title: "UC vs CSU: Which System is Right for You?",
      excerpt: "Compare the UC and CSU systems to make an informed decision about where to transfer.",
      author: "Emily Park",
      date: "November 25, 2025",
      category: "University Comparison"
    },
    {
      id: "4",
      title: "Writing Standout PIQ Essays: A Step-by-Step Guide",
      excerpt: "Master the art of writing compelling Personal Insight Questions that showcase your unique story.",
      author: "David Kim",
      date: "November 20, 2025",
      category: "Application Tips"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transfer Blog</h1>
          <p className="text-xl text-gray-600">
            Expert advice, success stories, and tips for your transfer journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <span className="text-sm text-primary-600 font-semibold">{post.category}</span>
                <CardTitle className="mt-2">{post.title}</CardTitle>
                <CardDescription className="mt-4">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {post.date}
                  </div>
                </div>
                <Button variant="link" className="mt-4 p-0">
                  Read More →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

