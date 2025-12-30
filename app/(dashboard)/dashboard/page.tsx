import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { BookOpen, Calendar, Users, TrendingUp, Target, Sparkles, Rocket, Award, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { TransferPrediction } from "@/components/transfer-prediction";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user profile data from database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      completedCourses: {
        include: {
          course: true,
        },
      },
      timeline: {
        include: {
          milestones: {
            orderBy: {
              dueDate: 'asc',
            },
          },
        },
      },
      applications: true,
    },
  });

  // Calculate stats
  const hasCompletedOnboarding = dbUser && dbUser.communityCollege && dbUser.currentMajor && dbUser.targetUniversities.length > 0;
  const coursesCompleted = dbUser?.completedCourses.length || 0;
  const upcomingDeadlines = dbUser?.timeline?.milestones.filter(m => !m.isCompleted && new Date(m.dueDate) > new Date()).length || 0;
  const applicationsCount = dbUser?.applications.length || 0;

  // Calculate transfer readiness percentage (more realistic calculation)
  let transferReadiness = 0;
  if (hasCompletedOnboarding) {
    // Start with base score for completing onboarding
    transferReadiness = 15;

    // Course completion (max 50 points) - requires significant progress
    // Assume typical transfer requires ~60 units (about 20 courses of 3 units each)
    const estimatedRequiredCourses = 20;
    const courseProgress = Math.min((coursesCompleted / estimatedRequiredCourses) * 50, 50);
    transferReadiness += Math.round(courseProgress);

    // Timeline setup (10 points)
    if (dbUser?.timeline) {
      transferReadiness += 10;

      // Milestone completion bonus (max 15 points)
      const completedMilestones = dbUser.timeline.milestones.filter(m => m.isCompleted).length;
      const totalMilestones = dbUser.timeline.milestones.length;
      if (totalMilestones > 0) {
        const milestoneProgress = (completedMilestones / totalMilestones) * 15;
        transferReadiness += Math.round(milestoneProgress);
      }
    }

    // Application progress (10 points for starting, more for completion)
    if (applicationsCount > 0) {
      transferReadiness += 10;
    }
  }

  // Cap at 100
  transferReadiness = Math.min(transferReadiness, 100);

  // Get community college and universities for display
  let communityCollege = null;
  let targetUniversities: any[] = [];

  if (dbUser?.communityCollege) {
    communityCollege = await prisma.communityCollege.findFirst({
      where: {
        OR: [
          { code: dbUser.communityCollege },
          { id: dbUser.communityCollege },
        ],
      },
    });
  }

  if (dbUser?.targetUniversities && dbUser.targetUniversities.length > 0) {
    targetUniversities = await prisma.university.findMany({
      where: {
        OR: [
          { id: { in: dbUser.targetUniversities } },
          { code: { in: dbUser.targetUniversities } },
        ],
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                  <h1 className="text-4xl font-bold text-white">
                    Welcome back, {user.firstName || "Student"}!
                  </h1>
                </div>
                <p className="text-blue-100 text-lg">
                  Let's continue your transfer journey to success
                </p>
              </div>
              <Rocket className="h-24 w-24 text-white/20" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Transfer Readiness"
            value={transferReadiness}
            subtitle={hasCompletedOnboarding ? `${transferReadiness}% complete` : "Complete onboarding to start"}
            icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
            color="blue"
          />
          <StatCard
            title="Courses Completed"
            value={coursesCompleted}
            subtitle={coursesCompleted > 0 ? `${coursesCompleted} courses tracked` : "Track your progress"}
            icon={<BookOpen className="h-5 w-5 text-green-600" />}
            color="green"
          />
          <StatCard
            title="Upcoming Deadlines"
            value={upcomingDeadlines}
            subtitle={upcomingDeadlines > 0 ? `${upcomingDeadlines} upcoming` : "Set your timeline"}
            icon={<Calendar className="h-5 w-5 text-orange-600" />}
            color="orange"
          />
          <StatCard
            title="Applications"
            value={applicationsCount}
            subtitle={applicationsCount > 0 ? `${applicationsCount} tracked` : "Start tracking"}
            icon={<Target className="h-5 w-5 text-purple-600" />}
            color="purple"
          />
        </div>

        {/* AI Transfer Prediction Section */}
        {hasCompletedOnboarding && (
          <div className="mb-8">
            <TransferPrediction />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2 hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>Track your required courses and prerequisites</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {hasCompletedOnboarding ? (
                  <>
                    <AnimatedProgress value={transferReadiness} max={100} color="primary" />
                    <div className="space-y-3">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p className="text-sm text-blue-900 font-semibold mb-2">Your Profile</p>
                        <div className="space-y-1 text-sm text-blue-800">
                          <p><span className="font-medium">Community College:</span> {communityCollege?.name || dbUser?.communityCollege}</p>
                          <p><span className="font-medium">Major:</span> {dbUser?.currentMajor}</p>
                          <p><span className="font-medium">Target Universities:</span> {targetUniversities.length > 0 ? targetUniversities.map(u => u.name).join(', ') : `${dbUser?.targetUniversities.length || 0} selected`}</p>
                        </div>
                      </div>
                      {coursesCompleted > 0 && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                          <p className="text-sm text-green-900 font-medium">
                            Great progress! You've completed {coursesCompleted} course{coursesCompleted !== 1 ? 's' : ''}.
                          </p>
                        </div>
                      )}
                    </div>
                    <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105">
                      View Course Plan
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <AnimatedProgress value={0} max={100} color="primary" />
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm text-blue-900 font-medium">
                        Complete your onboarding to see your personalized course plan and track your transfer progress.
                      </p>
                    </div>
                    <Link href="/onboarding" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105">
                      Start Onboarding
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with key features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {hasCompletedOnboarding ? (
                  <div className="block p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-green-700">Onboarding Complete!</div>
                        <div className="text-xs text-green-600">Profile is all set up</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/onboarding" className="block p-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer group transform hover:scale-[1.02] hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold group-hover:text-blue-600 transition-colors">Complete Onboarding</div>
                        <div className="text-xs text-gray-500">Set up your profile</div>
                      </div>
                    </div>
                  </Link>
                )}
                <Link href="/courses" className="block p-4 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-2 border-gray-200 hover:border-green-300 transition-all cursor-pointer group transform hover:scale-[1.02] hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold group-hover:text-green-600 transition-colors">View Course Plan</div>
                      <div className="text-xs text-gray-500">See your requirements</div>
                    </div>
                  </div>
                </Link>
                <Link href="/mentors" className="block p-4 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer group transform hover:scale-[1.02] hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold group-hover:text-purple-600 transition-colors">Find a Mentor</div>
                      <div className="text-xs text-gray-500">Connect with students</div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Additional Info Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-cyan-500 hover:scale-105 transform">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-100 rounded-full animate-pulse">
                  <Clock className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Next Steps</h3>
                  <p className="text-sm text-gray-600">Complete your profile setup</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:scale-105 transform">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Resources</h3>
                  <p className="text-sm text-gray-600">Explore transfer guides</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 hover:scale-105 transform">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Goal</h3>
                  <p className="text-sm text-gray-600">Transfer successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


