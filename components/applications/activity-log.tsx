"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface Activity {
  id?: string;
  title: string;
  description?: string;
  category: string;
  startDate?: string;
  endDate?: string;
  hoursPerWeek?: number;
}

interface ActivityLogProps {
  applicationId: string;
  activities: Activity[];
  onUpdate: (activities: Activity[]) => void;
}

const ACTIVITY_CATEGORIES = [
  "EXTRACURRICULAR",
  "VOLUNTEER",
  "WORK",
  "RESEARCH",
  "LEADERSHIP",
  "AWARD",
  "OTHER",
];

export function ActivityLog({ applicationId, activities, onUpdate }: ActivityLogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Activity>({
    title: "",
    description: "",
    category: "EXTRACURRICULAR",
    startDate: "",
    endDate: "",
    hoursPerWeek: 0,
  });

  const handleAdd = () => {
    onUpdate([...activities, { ...formData, id: Date.now().toString() }]);
    setFormData({
      title: "",
      description: "",
      category: "EXTRACURRICULAR",
      startDate: "",
      endDate: "",
      hoursPerWeek: 0,
    });
  };

  const handleDelete = (id: string) => {
    onUpdate(activities.filter(a => a.id !== id));
  };

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id || null);
    setFormData(activity);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(activities.map(a => a.id === editingId ? formData : a));
      setEditingId(null);
    } else {
      handleAdd();
    }
    setFormData({
      title: "",
      description: "",
      category: "EXTRACURRICULAR",
      startDate: "",
      endDate: "",
      hoursPerWeek: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          Track your extracurricular activities, work, and achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add/Edit Form */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Activity Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., President of Math Club"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {ACTIVITY_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {editingId ? "Update Activity" : "Add Activity"}
          </Button>
        </div>

        {/* Activities List */}
        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-3 border border-gray-200 rounded-lg flex items-start justify-between hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="font-semibold">{activity.title}</div>
                {activity.description && (
                  <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{activity.category.replace("_", " ")}</span>
                  {activity.startDate && (
                    <span>
                      {new Date(activity.startDate).toLocaleDateString()}
                      {activity.endDate && ` - ${new Date(activity.endDate).toLocaleDateString()}`}
                    </span>
                  )}
                  {activity.hoursPerWeek && (
                    <span>{activity.hoursPerWeek} hrs/week</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(activity)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => activity.id && handleDelete(activity.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No activities yet. Add your first activity above!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



