"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Clock, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { CourseNotifications } from "@/components/courses/course-notifications";
import { Mascot, MascotMessages } from "@/components/ui/mascot";

export function CoursesClient() {
  const { user } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalUnits: 0,
    completedUnits: 0,
    requiredCourses: 0,
    completedCourses: 0,
    geRequirements: 0,
    completedGE: 0
  });

  useEffect(() => {
    loadCourses();
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/courses/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      
      // First, get user's profile to fetch community college and universities
      const profileResponse = await fetch("/api/user/profile");
      if (!profileResponse.ok) {
        console.error("Failed to fetch user profile");
        return;
      }

      const profileData = await profileResponse.json();
      const profile = profileData.profile;

      if (!profile || !profile.communityCollege || !profile.targetUniversities || profile.targetUniversities.length === 0) {
        console.log("User profile incomplete. Please complete onboarding.");
        setLoading(false);
        return;
      }

      // Use first target university (or could loop through all)
      const targetUniversity = profile.targetUniversities[0];

      const response = await fetch("/api/courses/ai-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityCollegeId: profile.communityCollege.id,
          universityId: targetUniversity.id,
          majorId: profile.major?.id || null,
          completedCourseCodes: profile.completedCourseCodes || []
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.filtered || []);
        
        // Calculate summary
        const completed = data.filtered.filter((c: any) => c.isCompleted).length;
        setSummary({
          totalUnits: data.filtered.reduce((sum: number, c: any) => sum + (c.ccUnits || 0), 0),
          completedUnits: data.filtered
            .filter((c: any) => c.isCompleted)
            .reduce((sum: number, c: any) => sum + (c.ccUnits || 0), 0),
          requiredCourses: data.filtered.length,
          completedCourses: completed,
          geRequirements: 10, // Placeholder
          completedGE: 6 // Placeholder
        });
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const refilterWithAI = async () => {
    setFiltering(true);
    try {
      await loadCourses();
    } finally {
      setFiltering(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50/20 to-cyan-50/20 min-h-screen">
      {/* Mascot Section */}
      <div className="mb-8">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Mascot
                mood="encouraging"
                size="md"
                showName={false}
                animated={true}
              />
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  {MascotMessages.coursePlanning}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Planning</h1>
            <p className="text-gray-600">
              Track your completed courses and use ASSIST.org to find course equivalencies
            </p>
          </div>
        </div>
      </div>

      {/* ASSIST.org Guide Banner */}
      <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            How to Find Course Equivalencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/60 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 mb-3">
                <strong className="text-blue-800">Note:</strong> Course equivalency data from ASSIST.org changes frequently. For the most accurate and up-to-date information, please use ASSIST.org directly.
              </p>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Visit <a href="https://assist.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium underline">ASSIST.org</a></li>
                <li>Select your community college and target university</li>
                <li>Choose your intended major</li>
                <li>View the articulation agreement to see which courses transfer</li>
                <li>Add your completed courses below to track your progress</li>
              </ol>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="https://assist.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Open ASSIST.org
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-8">
          <CourseNotifications notifications={notifications} />
        </div>
      )}

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.completedUnits} / {summary.totalUnits}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.totalUnits > 0 
                ? Math.round((summary.completedUnits / summary.totalUnits) * 100)
                : 0}% complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Required Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.completedCourses} / {summary.requiredCourses}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.requiredCourses > 0
                ? Math.round((summary.completedCourses / summary.requiredCourses) * 100)
                : 0}% complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">GE Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.completedGE} / {summary.geRequirements}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((summary.completedGE / summary.geRequirements) * 100)}% complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <CourseNotifications notifications={notifications} />
      )}

      {/* Completed Courses List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Completed Courses</CardTitle>
              <CardDescription>
                Courses you've completed at your community college
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {summary.completedCourses === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses tracked yet.</p>
              <p className="text-sm text-gray-500">Add courses from your onboarding or update your profile to track your progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.filter(c => c.isCompleted).map((course, index) => (
                <div
                  key={course.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg bg-green-50 border-green-200"
                  style={{
                    animation: `fade-in-up 0.5s ease-out ${index * 50}ms both`
                  }}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{course.ccCourseCode}</h3>
                        <span className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full font-medium">
                          Completed
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.ccCourseName}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{course.ccUnits || 3} units</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

