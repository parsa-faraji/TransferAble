"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, AlertCircle, FileText, Target, Zap, TrendingUp } from "lucide-react";
import { AddMilestoneForm } from "@/components/timeline/add-milestone-form";
import { Button } from "@/components/ui/button";

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
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "APPLICATION_DEADLINE":
        return "from-red-500 to-orange-500";
      case "ESSAY_SUBMISSION":
        return "from-blue-500 to-cyan-500";
      case "EXAM_REGISTRATION":
        return "from-orange-500 to-yellow-500";
      case "TRANSCRIPT_REQUEST":
        return "from-green-500 to-emerald-500";
      case "COURSE_ENROLLMENT":
        return "from-purple-500 to-pink-500";
      case "FINANCIAL_AID":
        return "from-yellow-500 to-amber-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "APPLICATION_DEADLINE":
        return <Target className="h-5 w-5" />;
      case "ESSAY_SUBMISSION":
        return <FileText className="h-5 w-5" />;
      case "EXAM_REGISTRATION":
        return <Clock className="h-5 w-5" />;
      case "TRANSCRIPT_REQUEST":
        return <CheckCircle2 className="h-5 w-5" />;
      case "COURSE_ENROLLMENT":
        return <Calendar className="h-5 w-5" />;
      case "FINANCIAL_AID":
        return <Zap className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diff = date.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const sortedMilestones = [...data.milestones].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const upcoming = sortedMilestones.filter((m) => !m.isCompleted);
  const completed = sortedMilestones.filter((m) => m.isCompleted);
  const progress = data.milestones.length > 0 ? (completed.length / data.milestones.length) * 100 : 0;

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Transfer Timeline
            </h1>
            <p className="text-gray-600 text-lg">
              Stay on track with your transfer journey milestones
            </p>
          </div>
          <div className="flex gap-3">
            {!data.timeline && (
              <Button
                onClick={generateTimeline}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Timeline
              </Button>
            )}
            {data.timeline && (
              <AddMilestoneForm timelineId={data.timeline.id} onSuccess={fetchTimeline} />
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Target Term</p>
                  <p className="text-2xl font-bold mt-1">
                    {data.timeline?.targetTransferTerm || "Not Set"}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-blue-100 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Upcoming</p>
                  <p className="text-2xl font-bold mt-1">{upcoming.length}</p>
                </div>
                <Clock className="h-10 w-10 text-purple-100 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold mt-1">{completed.length}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-100 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-yellow-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Progress</p>
                  <p className="text-2xl font-bold mt-1">{Math.round(progress)}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-100 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline Visualization */}
      {upcoming.length === 0 && completed.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Milestones Yet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your transfer journey by adding important deadlines and milestones
            </p>
            {data.timeline ? (
              <AddMilestoneForm timelineId={data.timeline.id} onSuccess={fetchTimeline} />
            ) : (
              <Button onClick={generateTimeline} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Generate Timeline
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Milestones - Visual Timeline */}
          {upcoming.length > 0 && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <CardTitle className="text-2xl">Upcoming Milestones</CardTitle>
                <CardDescription>Your roadmap to transfer success</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {upcoming.map((milestone, index) => {
                    const daysUntil = getDaysUntil(milestone.dueDate);
                    const isUrgent = daysUntil <= 14;
                    const isSoon = daysUntil <= 30 && daysUntil > 14;

                    return (
                      <div key={milestone.id} className="relative">
                        {/* Timeline connector line */}
                        {index < upcoming.length - 1 && (
                          <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent" />
                        )}

                        <div className={`relative flex gap-4 p-5 rounded-xl border-2 transition-all hover:shadow-lg ${
                          isUrgent
                            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
                            : isSoon
                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300'
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}>
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(milestone.category)} flex items-center justify-center text-white shadow-lg`}>
                            {getCategoryIcon(milestone.category)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {milestone.title}
                              </h3>
                              <div className="flex flex-col items-end gap-1">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  isUrgent
                                    ? 'bg-red-100 text-red-700'
                                    : isSoon
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {daysUntil > 0 ? `${daysUntil} days left` : daysUntil === 0 ? 'Due today!' : `${Math.abs(daysUntil)} days overdue`}
                                </span>
                              </div>
                            </div>

                            {milestone.description && (
                              <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                                {milestone.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(milestone.dueDate).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}</span>
                              </div>

                              <Button
                                onClick={() => handleMilestoneToggle(milestone.id, milestone.isCompleted)}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                size="sm"
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark Complete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Milestones */}
          {completed.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  Completed ({completed.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {completed.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-500 line-through">
                          {milestone.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Completed {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
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
      )}
    </div>
  );
}
