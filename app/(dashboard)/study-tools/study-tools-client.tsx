"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Target,
  Brain,
  Calendar,
  CheckSquare,
  FileText,
  Lightbulb,
  Calculator,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

export function StudyToolsClient() {
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pomodoroMinutes * 60);

  const studyResources = [
    {
      title: "Khan Academy",
      description: "Free courses in math, science, and more",
      url: "https://www.khanacademy.org",
      icon: <BookOpen className="h-6 w-6" />,
      color: "blue",
    },
    {
      title: "Quizlet",
      description: "Create flashcards and study sets",
      url: "https://quizlet.com",
      icon: <Brain className="h-6 w-6" />,
      color: "purple",
    },
    {
      title: "Wolfram Alpha",
      description: "Computational knowledge engine for math",
      url: "https://www.wolframalpha.com",
      icon: <Calculator className="h-6 w-6" />,
      color: "orange",
    },
    {
      title: "Grammarly",
      description: "Writing assistant for essays and papers",
      url: "https://www.grammarly.com",
      icon: <FileText className="h-6 w-6" />,
      color: "green",
    },
  ];

  const studyTechniques = [
    {
      title: "Pomodoro Technique",
      description: "Work in 25-minute focused intervals with 5-minute breaks",
      tips: ["Remove all distractions", "Set a timer for 25 minutes", "Take short breaks"],
    },
    {
      title: "Active Recall",
      description: "Test yourself on material instead of passive reading",
      tips: ["Close your notes and try to recall", "Create practice questions", "Teach concepts to others"],
    },
    {
      title: "Spaced Repetition",
      description: "Review material at increasing intervals over time",
      tips: ["Use flashcard apps like Anki", "Review material after 1 day, 3 days, 1 week", "Focus on difficult concepts more"],
    },
    {
      title: "Feynman Technique",
      description: "Explain concepts in simple terms to deepen understanding",
      tips: ["Write out the concept simply", "Identify gaps in knowledge", "Simplify and use analogies"],
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Tools & Resources</h1>
        <p className="text-gray-600">
          Boost your learning with study techniques and helpful resources
        </p>
      </div>

      {/* Pomodoro Timer */}
      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Pomodoro Timer</CardTitle>
              <CardDescription>
                Focus for {pomodoroMinutes} minutes, then take a break
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-4">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setPomodoroActive(!pomodoroActive);
                    if (!pomodoroActive) {
                      const timer = setInterval(() => {
                        setTimeLeft((prev) => {
                          if (prev <= 0) {
                            clearInterval(timer);
                            return pomodoroMinutes * 60;
                          }
                          return prev - 1;
                        });
                      }, 1000);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                >
                  {pomodoroActive ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPomodoroActive(false);
                    setTimeLeft(pomodoroMinutes * 60);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Session Length</div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPomodoroMinutes(15);
                    setTimeLeft(15 * 60);
                  }}
                >
                  15m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPomodoroMinutes(25);
                    setTimeLeft(25 * 60);
                  }}
                >
                  25m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPomodoroMinutes(45);
                    setTimeLeft(45 * 60);
                  }}
                >
                  45m
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Techniques */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Proven Study Techniques</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {studyTechniques.map((technique, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{technique.title}</CardTitle>
                    <CardDescription>{technique.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">How to apply:</div>
                  <ul className="space-y-1">
                    {technique.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Study Resources */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Helpful Study Resources</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studyResources.map((resource, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
              onClick={() => window.open(resource.url, '_blank')}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 bg-${resource.color}-100 text-${resource.color}-600 rounded-full group-hover:scale-110 transition-transform`}>
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    Visit Site
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
            <CardTitle>Quick Study Tips</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg flex-shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Study Consistently</div>
                <div className="text-sm text-gray-600">Better to study 30 min daily than 3 hours once a week</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg flex-shrink-0">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Mix It Up</div>
                <div className="text-sm text-gray-600">Alternate between different subjects for better retention</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg flex-shrink-0">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Set Goals</div>
                <div className="text-sm text-gray-600">Break large topics into smaller, achievable goals</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Take Breaks</div>
                <div className="text-sm text-gray-600">Your brain needs rest to consolidate information</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
