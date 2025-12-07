"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AddMilestoneFormProps {
  timelineId: string;
  onSuccess: () => void;
}

export function AddMilestoneForm({ timelineId, onSuccess }: AddMilestoneFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "OTHER" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/timeline/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timelineId,
          ...formData,
        }),
      });

      if (response.ok) {
        onSuccess();
        setIsOpen(false);
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          category: "OTHER",
        });
      }
    } catch (error) {
      console.error("Error creating milestone:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        Add Milestone
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Milestone</CardTitle>
        <CardDescription>Create a new deadline or important event</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="COURSE_ENROLLMENT">Course Enrollment</option>
              <option value="APPLICATION_DEADLINE">Application Deadline</option>
              <option value="EXAM_REGISTRATION">Exam Registration</option>
              <option value="ESSAY_SUBMISSION">Essay Submission</option>
              <option value="TRANSCRIPT_REQUEST">Transcript Request</option>
              <option value="FINANCIAL_AID">Financial Aid</option>
              <option value="HOUSING_APPLICATION">Housing Application</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Milestone"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

