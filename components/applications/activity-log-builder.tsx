"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, Calendar, Clock, Briefcase, Heart, Award, Users } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  startDate: string;
  endDate?: string;
  hoursPerWeek?: number;
}

type ActivityCategory = "EXTRACURRICULAR" | "VOLUNTEER" | "WORK" | "RESEARCH" | "LEADERSHIP" | "AWARD" | "OTHER";

interface ActivityLogBuilderProps {
  applicationId: string;
  onSave: (activities: Activity[]) => void;
}

const categoryIcons = {
  EXTRACURRICULAR: Users,
  VOLUNTEER: Heart,
  WORK: Briefcase,
  RESEARCH: Award,
  LEADERSHIP: Users,
  AWARD: Award,
  OTHER: Calendar,
};

const categoryLabels = {
  EXTRACURRICULAR: "Extracurricular",
  VOLUNTEER: "Volunteer",
  WORK: "Work",
  RESEARCH: "Research",
  LEADERSHIP: "Leadership",
  AWARD: "Award",
  OTHER: "Other",
};

export function ActivityLogBuilder({ applicationId, onSave }: ActivityLogBuilderProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: "",
    description: "",
    category: "EXTRACURRICULAR",
    startDate: "",
    endDate: "",
    hoursPerWeek: undefined,
  });

  const addActivity = () => {
    if (!formData.title) return;

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: formData.title!,
      description: formData.description || "",
      category: formData.category || "OTHER",
      startDate: formData.startDate || new Date().toISOString().split("T")[0],
      endDate: formData.endDate,
      hoursPerWeek: formData.hoursPerWeek,
    };

    setActivities([...activities, newActivity]);
    setFormData({
      title: "",
      description: "",
      category: "EXTRACURRICULAR",
      startDate: "",
      endDate: "",
      hoursPerWeek: undefined,
    });
    setShowForm(false);
    onSave([...activities, newActivity]);
  };

  const removeActivity = (id: string) => {
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    onSave(updated);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Build your extracurricular and activity profile
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., President of Math Club"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your role and achievements..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ActivityCategory })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours/Week
                  </label>
                  <input
                    type="number"
                    value={formData.hoursPerWeek || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hoursPerWeek: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addActivity} className="flex-1">
                  Add Activity
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      title: "",
                      description: "",
                      category: "EXTRACURRICULAR",
                      startDate: "",
                      endDate: "",
                      hoursPerWeek: undefined,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No activities added yet. Click "Add Activity" to get started.</p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = categoryIcons[activity.category];
              return (
                <div
                  key={activity.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {categoryLabels[activity.category]}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(activity.startDate).toLocaleDateString()}
                            {activity.endDate &&
                              ` - ${new Date(activity.endDate).toLocaleDateString()}`}
                          </span>
                          {activity.hoursPerWeek && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.hoursPerWeek} hrs/week
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActivity(activity.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

