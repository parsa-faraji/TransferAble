"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AskTemplates } from "./ask-templates";

interface RequestMentorFormProps {
  mentorId: string;
  mentorName: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function RequestMentorForm({ mentorId, mentorName, onSuccess, onClose }: RequestMentorFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    topic: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/mentors/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId,
          ...formData,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        alert("Failed to send request. Please try again.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Request Mentorship from {mentorName}</CardTitle>
          <CardDescription>Send a message to request mentorship</CardDescription>
        </CardHeader>
        <CardContent>
          <AskTemplates
            onSelectTemplate={(template) => {
              setFormData({ ...formData, message: template });
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Send Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              required
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., Course Planning, PIQ Help, Major Selection"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell the mentor what you need help with..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  );
}

