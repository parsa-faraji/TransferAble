import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Calendar, Users, FileText, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeaturesPage() {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary-600" />,
      title: "Smart Course Planning",
      description: "Automatically track requirements, prerequisites, and course equivalencies across all your target universities.",
      details: [
        "Real-time course equivalency database",
        "Prerequisite tracking and alerts",
        "Progress visualization",
        "Multi-university requirement mapping"
      ]
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary-600" />,
      title: "Transfer Timeline",
      description: "Never miss a deadline with personalized timelines that track applications, exams, and important dates.",
      details: [
        "Automated deadline tracking",
        "Custom milestone creation",
        "Email and in-app reminders",
        "Application deadline calendar"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: "Peer Mentorship",
      description: "Connect with verified mentors from your target universities for personalized guidance and support.",
      details: [
        "Verified mentor profiles",
        "In-app messaging system",
        "Mentor matching algorithm",
        "Success story sharing"
      ]
    },
    {
      icon: <FileText className="h-8 w-8 text-primary-600" />,
      title: "Application Hub",
      description: "PIQ brainstorming, essay tracking, activity logs, and automated feedback to strengthen your applications.",
      details: [
        "PIQ essay templates and prompts",
        "Activity log builder",
        "Essay progress tracking",
        "Application status dashboard"
      ]
    },
    {
      icon: <Award className="h-8 w-8 text-primary-600" />,
      title: "Resource Library",
      description: "Access scholarships, transfer stories, campus comparisons, and student-generated advice.",
      details: [
        "Scholarship finder",
        "Transfer success stories",
        "Campus comparison tools",
        "Community forum"
      ]
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
      title: "Progress Tracking",
      description: "Visual dashboards show your transfer readiness, course completion, and application progress.",
      details: [
        "Real-time progress metrics",
        "Transfer readiness score",
        "Completion percentage tracking",
        "Achievement badges"
      ]
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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All the Features You Need</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything in one place to make your transfer journey smooth and successful
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-primary-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students using TransferAble to plan their transfer
          </p>
          <Button size="lg" asChild>
            <Link href="/sign-up">Start Free Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

