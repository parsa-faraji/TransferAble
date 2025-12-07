"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Clock, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { CourseNotifications } from "@/components/courses/course-notifications";

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
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Planning</h1>
            <p className="text-gray-600">
              AI-filtered course equivalencies - only accurate entries are shown
            </p>
          </div>
          <Button 
            onClick={refilterWithAI} 
            disabled={filtering}
            variant="outline"
            className="flex items-center gap-2"
          >
            {filtering ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Filtering...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Re-filter with AI
              </>
            )}
          </Button>
        </div>
      </div>

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

      {/* Course List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>AI-Filtered Course Equivalencies</CardTitle>
              <CardDescription>
                Only validated, accurate course articulations are displayed
              </CardDescription>
            </div>
            <Button asChild>
              <a href="/education-plan">Generate Education Plan</a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No courses found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md group cursor-pointer"
                  style={{
                    animation: `fade-in-up 0.5s ease-out ${index * 50}ms both`
                  }}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    {getStatusIcon(course.status || "pending")}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{course.ccCourseCode}</h3>
                        <span className="text-gray-400">→</span>
                        <h3 className="font-semibold text-gray-900">{course.ucCourseCode}</h3>
                        {course.isVerified && (
                          <span className="px-2 py-1 text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-medium shadow-sm">
                            ✓ Verified
                          </span>
                        )}
                        {course.confidence && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            course.confidence === "high" 
                              ? "bg-blue-100 text-blue-800"
                              : course.confidence === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {course.confidence} confidence
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.ccCourseName} → {course.ucCourseName}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{course.ccUnits || 3} units</span>
                        {course.relationshipType && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {course.relationshipType} relationship
                          </span>
                        )}
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

