"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";
import { AddMilestoneForm } from "@/components/timeline/add-milestone-form";
import { Button } from "@/components/ui/button";
import { Mascot, MascotMessages } from "@/components/ui/mascot";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  category: string;
  isCompleted: boolean;
}

interface TimelineData {
  timeline: {
    id: string;
    targetTransferTerm: string;
  } | null;
  milestones: Milestone[];
}

export function TimelineClient() {
  const [data, setData] = useState<TimelineData>({ timeline: null, milestones: [] });
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    try {
      const response = await fetch("/api/timeline");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const generateTimeline = async () => {
    try {
      const response = await fetch("/api/timeline/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetTransferTerm: data.timeline?.targetTransferTerm || "Fall 2026",
        }),
      });
      if (response.ok) {
        fetchTimeline();
      }
    } catch (error) {
      console.error("Error generating timeline:", error);
    }
  };

  const handleMilestoneToggle = async (id: string, isCompleted: boolean) => {
    try {
      const response = await fetch("/api/timeline/milestones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isCompleted: !isCompleted }),
      });

      if (response.ok) {
        fetchTimeline();
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "APPLICATION_DEADLINE":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "ESSAY_SUBMISSION":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "EXAM_REGISTRATION":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "TRANSCRIPT_REQUEST":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "COURSE_ENROLLMENT":
        return <Calendar className="h-5 w-5 text-purple-600" />;
      case "FINANCIAL_AID":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diff = date.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const upcoming = data.milestones.filter((m) => !m.isCompleted);
  const completed = data.milestones.filter((m) => m.isCompleted);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-orange-50/20 to-red-50/20 min-h-screen">
      {/* Mascot Section */}
      <div className="mb-8">
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Mascot
                mood="celebrating"
                size="md"
                showName={false}
                animated={true}
              />
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  {MascotMessages.deadlineReminder}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Timeline</h1>
          <p className="text-gray-600">
            Track important deadlines and milestones for your transfer journey
          </p>
        </div>
        <div className="flex gap-2">
          {!data.timeline && (
            <Button onClick={generateTimeline} variant="outline" className="hover:scale-105 transition-transform">
              Generate Timeline
            </Button>
          )}
          {data.timeline && (
            <AddMilestoneForm timelineId={data.timeline.id} onSuccess={fetchTimeline} />
          )}
        </div>
      </div>

      {/* Timeline Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcoming.length}</div>
            <p className="text-xs text-gray-500 mt-1">Next 90 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completed.length}</div>
            <p className="text-xs text-gray-500 mt-1">Milestones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Target Transfer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.timeline?.targetTransferTerm || "Not set"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Term</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Milestones */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upcoming Milestones</CardTitle>
          <CardDescription>Important dates and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No upcoming milestones. Add one to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((milestone) => {
                const daysUntil = getDaysUntil(milestone.dueDate);
                const isUrgent = daysUntil <= 30;
                return (
                  <div
                    key={milestone.id}
                    className={`flex items-start space-x-4 p-4 border rounded-lg ${
                      isUrgent ? "border-red-200 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    {getCategoryIcon(milestone.category)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                        <span className={`text-sm font-medium ${
                          isUrgent ? "text-red-600" : "text-gray-600"
                        }`}>
                          {daysUntil > 0 ? `${daysUntil} days` : "Due today"}
                        </span>
                      </div>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMilestoneToggle(milestone.id, milestone.isCompleted)}
                    >
                      Mark Complete
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Milestones */}
      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Recently completed milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completed.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 line-through">
                        {milestone.title}
                      </h3>
                      <span className="text-sm text-green-600">Completed</span>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMilestoneToggle(milestone.id, milestone.isCompleted)}
                  >
                    Undo
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

