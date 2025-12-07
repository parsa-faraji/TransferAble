"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";

interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  category: "resume" | "portfolio" | "cv";
  preview: string;
}

const templates: PortfolioTemplate[] = [
  {
    id: "academic-resume",
    name: "Academic Resume",
    description: "Clean, professional format perfect for transfer applications",
    category: "resume",
    preview: "Academic format with education focus",
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    description: "Showcase your projects and achievements visually",
    category: "portfolio",
    preview: "Visual portfolio template",
  },
  {
    id: "professional-cv",
    name: "Professional CV",
    description: "Comprehensive CV format for graduate school applications",
    category: "cv",
    preview: "Extended CV format",
  },
];

export function PortfolioTemplates() {
  const handleUseTemplate = (templateId: string) => {
    // TODO: Open template editor or download
    console.log("Using template:", templateId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Portfolio & Resume Templates
        </CardTitle>
        <CardDescription>
          Professional templates to showcase your achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="mb-3">
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {template.category}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

