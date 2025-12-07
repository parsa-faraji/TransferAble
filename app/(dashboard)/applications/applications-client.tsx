"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";
import { PIQEditor } from "@/components/applications/piq-editor";
import { ActivityLog } from "@/components/applications/activity-log";

interface Application {
  id: string;
  universityId: string;
  university: string;
  major: string;
  status: string;
  deadline: string;
  essaysCompleted: number;
  essaysTotal: number;
  progress: number;
}

interface UniversityOption {
  id: string;
  name: string;
  code?: string | null;
  type?: string | null;
  city?: string | null;
  state?: string | null;
}

interface ApplicationsClientProps {
  applications: Application[];
  universities: UniversityOption[];
}

const PIQ_PROMPTS = [
  "Describe an example of your leadership experience...",
  "Every person has a creative side...",
  "What would you say is your greatest talent or skill?",
  "Describe how you have taken advantage of an educational opportunity...",
  "Describe the most significant challenge you have faced...",
  "Think about an academic subject that inspires you...",
  "What have you done to make your school or your community a better place?",
  "Beyond what has already been shared in your application...",
];

export function ApplicationsClient({ applications: initialApplications, universities }: ApplicationsClientProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedEssay, setSelectedEssay] = useState<number | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [showNewAppForm, setShowNewAppForm] = useState(false);
  const [newAppData, setNewAppData] = useState({
    universityId: "",
    customUniversity: "",
    major: "",
    deadline: "",
  });

  const formatApplication = (app: any): Application => {
    const essaysCompleted = Array.isArray(app.essays)
      ? app.essays.filter((e: any) => e?.isComplete).length
      : app.essaysCompleted || 0;
    const essaysTotal = Array.isArray(app.essays) ? app.essays.length : app.essaysTotal || 0;
    const progress = essaysTotal > 0
      ? Math.round((essaysCompleted / essaysTotal) * 100)
      : app.status === "SUBMITTED"
      ? 100
      : 10;

    return {
      id: app.id,
      universityId: app.universityId || app.university?.id || "",
      university: app.university?.name || app.university || "University",
      major: app.majorName || app.majorId || "Undeclared",
      status: app.status || "DRAFT",
      deadline: typeof app.deadline === "string" ? app.deadline : new Date(app.deadline).toISOString(),
      essaysCompleted,
      essaysTotal,
      progress,
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSaveActivities = async (appId: string, newActivities: any[]) => {
    try {
      const response = await fetch(`/api/applications/${appId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities: newActivities }),
      });
      if (response.ok) {
        setActivities(newActivities);
      }
    } catch (error) {
      console.error("Error saving activities:", error);
    }
  };

  const handleCreateApplication = async () => {
    if ((!newAppData.universityId && !newAppData.customUniversity) || !newAppData.deadline) {
      alert("Please select a university (or add one) and a deadline.");
      return;
    }

    try {
      const selectedUniversity = universities.find((u) => u.id === newAppData.universityId);
      const payload = {
        universityId: newAppData.universityId || undefined,
        universityCode: selectedUniversity?.code,
        universityName: newAppData.customUniversity || selectedUniversity?.name,
        major: newAppData.major || undefined,
        deadline: newAppData.deadline,
        status: "DRAFT",
      };

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create application");
      }

      const created = formatApplication(data.application || data);
      setApplications([...applications, created]);
      setSelectedApp(created.id);
      setShowNewAppForm(false);
      setNewAppData({ universityId: "", customUniversity: "", major: "", deadline: "" });
    } catch (error) {
      console.error("Error creating application:", error);
      alert("Failed to create application. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-600">
            Track your UC/CSU application progress and essays
          </p>
        </div>
        <Button onClick={() => setShowNewAppForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Application
        </Button>
      </div>

      {/* New Application Form Modal */}
      {showNewAppForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create New Application</CardTitle>
                  <CardDescription>
                    Start tracking a new UC, CSU, or private university application
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewAppForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select University *
                  </label>
                  <select
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAppData.universityId || (newAppData.customUniversity ? "custom" : "")}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "custom") {
                        setNewAppData({ ...newAppData, universityId: "", customUniversity: "" });
                      } else {
                        setNewAppData({ ...newAppData, universityId: value, customUniversity: "" });
                      }
                    }}
                  >
                    <option value="">Choose a university...</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name} {uni.code ? `(${uni.code})` : ""}
                      </option>
                    ))}
                    <option value="custom">Other / Not listed</option>
                  </select>
                  {(!newAppData.universityId || newAppData.universityId === "custom") && (
                    <input
                      type="text"
                      placeholder="Enter university name"
                      className="mt-3 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAppData.customUniversity}
                      onChange={(e) => setNewAppData({ ...newAppData, customUniversity: e.target.value, universityId: "custom" })}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intended Major (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science, Biology, Business"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAppData.major}
                    onChange={(e) => setNewAppData({ ...newAppData, major: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAppData.deadline}
                    onChange={(e) => setNewAppData({ ...newAppData, deadline: e.target.value })}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    UC/CSU typically due November 30th for fall transfer
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={handleCreateApplication}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Application
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewAppForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Applications List */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {applications.length === 0 ? (
          <div className="col-span-2">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Applications Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start tracking your UC/CSU applications
                  </p>
                  <Button onClick={() => setShowNewAppForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          applications.map((app) => (
            <Card 
              key={app.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${
                selectedApp === app.id ? "border-purple-500 border-2" : ""
              }`}
              onClick={() => setSelectedApp(app.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{app.university}</CardTitle>
                    <CardDescription>{app.major}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                    {app.status.replace("_", " ")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{app.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <FileText className="inline h-4 w-4 mr-1" />
                      Essays: {app.essaysCompleted} / {app.essaysTotal} completed
                    </p>
                    <p className="text-sm text-gray-600">
                      Deadline: {new Date(app.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Button className="w-full" variant="outline">
                    Continue Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* PIQ Helper */}
      {selectedApp && (
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>PIQ (Personal Insight Questions) Helper</CardTitle>
              <CardDescription>
                Get help brainstorming and writing your UC application essays
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {PIQ_PROMPTS.map((prompt, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedEssay === index
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSelectedEssay(index)}
                  >
                    <h3 className="font-semibold mb-2">Question {index + 1}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{prompt}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {selectedEssay === index ? "Editing..." : "Start Writing"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedEssay !== null && (
            <PIQEditor
              applicationId={selectedApp}
              prompt={PIQ_PROMPTS[selectedEssay]}
              wordLimit={350}
            />
          )}

          <ActivityLog
            applicationId={selectedApp}
            activities={activities}
            onUpdate={(newActivities) => handleSaveActivities(selectedApp, newActivities)}
          />
        </div>
      )}
    </div>
  );
}
