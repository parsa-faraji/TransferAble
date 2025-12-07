"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, BookOpen, GraduationCap, FileText } from "lucide-react";

const templates = [
  {
    id: "course-selection",
    icon: <BookOpen className="h-5 w-5" />,
    title: "Course Selection",
    questions: [
      "What courses should I take next semester?",
      "Which GE courses are easiest to complete?",
      "How do I balance major prep and GE requirements?",
    ],
  },
  {
    id: "major-guidance",
    icon: <GraduationCap className="h-5 w-5" />,
    title: "Major Guidance",
    questions: [
      "What's the workload like for [major]?",
      "Should I switch majors?",
      "What career paths are available?",
    ],
  },
  {
    id: "piq-help",
    icon: <FileText className="h-5 w-5" />,
    title: "PIQ Essay Help",
    questions: [
      "How do I answer PIQ question 1?",
      "What makes a strong PIQ essay?",
      "Can you review my essay draft?",
    ],
  },
  {
    id: "admissions",
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Admissions Advice",
    questions: [
      "What made your application stand out?",
      "How competitive is [university]?",
      "What should I focus on to improve my chances?",
    ],
  },
];

interface AskTemplatesProps {
  onSelect?: (question: string) => void;
  onSelectTemplate?: (template: string) => void;
}

export function AskTemplates({ onSelect, onSelectTemplate }: AskTemplatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask Templates</CardTitle>
        <p className="text-sm text-gray-600">
          Start conversations with pre-written questions
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <div key={template.id} className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                {template.icon}
                {template.title}
              </div>
              <div className="space-y-1">
                {template.questions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-sm h-auto py-2"
                    onClick={() => {
                      if (onSelect) onSelect(question);
                      if (onSelectTemplate) onSelectTemplate(question);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
