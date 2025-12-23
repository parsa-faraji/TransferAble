"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Sparkles, Loader2, Lock } from "lucide-react";
import Link from "next/link";

export function HomeworkHelpClient() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/homework-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, subject }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.answer);
      } else {
        const error = await res.json();
        setResponse(`Error: ${error.error || "Failed to get help"}`);
      }
    } catch (error) {
      setResponse("Error: Failed to get help. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI Homework Help</h1>
          <span className="ml-auto px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold">
            Premium Feature
          </span>
        </div>
        <p className="text-gray-600">
          Get instant help with your homework questions using AI-powered tutoring
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
            <CardDescription>
              Get step-by-step explanations for any subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a subject...</option>
                  <option value="Math">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your homework question here..."
                  rows={6}
                  required
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !question || !subject}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting help...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Help
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
            <CardDescription>
              Your personalized explanation will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">{response}</div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ask a question to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Feature</h3>
              <p className="text-sm text-gray-600 mb-4">
                AI Homework Help is available exclusively for Premium members. Upgrade to unlock this and other premium features.
              </p>
              <Button asChild variant="outline">
                <Link href="/payments">Upgrade to Premium</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




