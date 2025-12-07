"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Sparkles, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface PIQEditorProps {
  applicationId: string;
  essayId?: string;
  prompt: string;
  initialContent?: string;
  wordLimit?: number;
}

const PIQ_PROMPTS = [
  {
    id: 1,
    prompt: "Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes or contributed to group efforts over time.",
    wordLimit: 350,
  },
  {
    id: 2,
    prompt: "Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side.",
    wordLimit: 350,
  },
  {
    id: 3,
    prompt: "What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time?",
    wordLimit: 350,
  },
  {
    id: 4,
    prompt: "Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced.",
    wordLimit: 350,
  },
  {
    id: 5,
    prompt: "Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge. How has this challenge affected your academic achievement?",
    wordLimit: 350,
  },
  {
    id: 6,
    prompt: "Think about an academic subject that inspires you. Describe how you have furthered this interest inside and/or outside of the classroom.",
    wordLimit: 350,
  },
  {
    id: 7,
    prompt: "What have you done to make your school or your community a better place?",
    wordLimit: 350,
  },
  {
    id: 8,
    prompt: "Beyond what has already been shared in your application, what do you believe makes you a strong candidate for admissions to the University of California?",
    wordLimit: 350,
  },
];

export function PIQEditor({
  applicationId,
  essayId,
  prompt,
  initialContent = "",
  wordLimit = 350,
}: PIQEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > wordLimit;
  const isUnderLimit = wordCount < wordLimit * 0.8;

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}/essays`, {
        method: essayId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essayId,
          prompt,
          content,
          wordCount,
          isComplete: wordCount >= wordLimit * 0.9 && wordCount <= wordLimit,
        }),
      });

      if (response.ok) {
        setFeedback("Saved successfully!");
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (error) {
      console.error("Error saving essay:", error);
      setFeedback("Error saving essay");
    } finally {
      setSaving(false);
    }
  };

  const getAIFeedback = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/applications/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, content }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error("Error getting feedback:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PIQ Essay Editor
        </CardTitle>
        <CardDescription>{prompt}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${
              isOverLimit ? "text-red-600" : 
              isUnderLimit ? "text-orange-600" : 
              "text-green-600"
            }`}>
              {wordCount} / {wordLimit} words
            </span>
            {isOverLimit && (
              <span className="text-xs text-red-600">
                Over limit by {wordCount - wordLimit} words
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={getAIFeedback}
              disabled={!content.trim()}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Feedback
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your essay here..."
          className="min-h-[300px] font-sans"
        />
        {feedback && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            {feedback}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



