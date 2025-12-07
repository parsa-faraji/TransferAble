import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { BookOpen, Calendar, Users, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName || "Student"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your transfer journey overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Transfer Readiness"
            value={0}
            subtitle="Complete onboarding to start"
            icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
            color="blue"
          />
          <StatCard
            title="Courses Completed"
            value={0}
            subtitle="Track your progress"
            icon={<BookOpen className="h-5 w-5 text-blue-600" />}
            color="blue"
          />
          <StatCard
            title="Upcoming Deadlines"
            value={0}
            subtitle="Set your timeline"
            icon={<Calendar className="h-5 w-5 text-blue-600" />}
            color="blue"
          />
          <StatCard
            title="Applications"
            value={0}
            subtitle="Start tracking"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Track your required courses and prerequisites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatedProgress value={0} max={100} color="primary" />
                <div className="text-sm text-gray-500">
                  Complete your onboarding to see your personalized course plan and track your transfer progress.
                </div>
                <Link href="/onboarding" className="text-primary-600 hover:underline inline-block font-medium hover:text-blue-700 transition-colors">
                  Start Onboarding →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with key features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/onboarding" className="block p-3 rounded-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group transform hover:scale-[1.02]">
                  <div className="font-medium group-hover:text-blue-600 transition-colors">Complete Onboarding</div>
                  <div className="text-sm text-gray-500">Set up your profile</div>
                </Link>
                <Link href="/courses" className="block p-3 rounded-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group transform hover:scale-[1.02]">
                  <div className="font-medium group-hover:text-blue-600 transition-colors">View Course Plan</div>
                  <div className="text-sm text-gray-500">See your requirements</div>
                </Link>
                <Link href="/mentors" className="block p-3 rounded-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group transform hover:scale-[1.02]">
                  <div className="font-medium group-hover:text-blue-600 transition-colors">Find a Mentor</div>
                  <div className="text-sm text-gray-500">Connect with students</div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


