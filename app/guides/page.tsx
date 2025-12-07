import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, FileText, GraduationCap, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GuidesPage() {
  const guides = [
    {
      icon: <GraduationCap className="h-8 w-8 text-primary-600" />,
      title: "Complete Transfer Guide",
      description: "Everything you need to know about transferring from community college to a 4-year university.",
      category: "Getting Started"
    },
    {
      icon: <Target className="h-8 w-8 text-primary-600" />,
      title: "UC Transfer Requirements",
      description: "Detailed breakdown of UC system requirements, IGETC, and major prerequisites.",
      category: "UC System"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary-600" />,
      title: "CSU Transfer Guide",
      description: "Complete guide to transferring to California State University campuses.",
      category: "CSU System"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary-600" />,
      title: "Course Planning 101",
      description: "How to plan your courses effectively to meet all transfer requirements.",
      category: "Course Planning"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary-600" />,
      title: "PIQ Essay Writing Guide",
      description: "Step-by-step guide to writing compelling Personal Insight Questions.",
      category: "Applications"
    },
    {
      icon: <Target className="h-8 w-8 text-primary-600" />,
      title: "Financial Aid for Transfers",
      description: "Understanding scholarships, grants, and financial aid for transfer students.",
      category: "Financial Aid"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transfer Guides</h1>
          <p className="text-xl text-gray-600">
            Comprehensive guides to help you navigate every step of your transfer journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="mb-4">{guide.icon}</div>
                <span className="text-sm text-primary-600 font-semibold">{guide.category}</span>
                <CardTitle className="mt-2">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Read Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

