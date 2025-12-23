"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, TrendingUp, AlertCircle, Loader2, Target, Award, LightbulbIcon } from "lucide-react";

interface UniversityPrediction {
  university: string;
  likelihood: "high" | "medium" | "low";
  percentage: number;
  reasoning: string;
}

interface TransferPrediction {
  overallReadiness: number;
  universityPredictions: UniversityPrediction[];
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
}

export function TransferPrediction() {
  const [gpa, setGpa] = useState("");
  const [essayQuality, setEssayQuality] = useState("");
  const [extracurriculars, setExtracurriculars] = useState("");
  const [personalStatementQuality, setPersonalStatementQuality] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<TransferPrediction | null>(null);

  const handleGeneratePrediction = async () => {
    if (!gpa) {
      setError("Please enter your GPA");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("/api/transfer-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gpa: parseFloat(gpa),
          essayQuality: essayQuality || "Not assessed",
          extracurriculars: extracurriculars || "Not provided",
          personalStatementQuality: personalStatementQuality || "Not assessed",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate prediction" }));
        setError(errorData.error || "Failed to generate prediction. Please try again.");
        return;
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "high":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-purple-500">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>AI Transfer Prediction</CardTitle>
            <CardDescription>Get personalized insights on your transfer chances</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="gpa" className="text-sm font-medium">
                Current GPA <span className="text-red-500">*</span>
              </Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="e.g., 3.5"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="essayQuality" className="text-sm font-medium">
                Essay Quality (optional)
              </Label>
              <Input
                id="essayQuality"
                placeholder="e.g., Strong, Good, Needs improvement"
                value={essayQuality}
                onChange={(e) => setEssayQuality(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="extracurriculars" className="text-sm font-medium">
                Extracurriculars (optional)
              </Label>
              <Input
                id="extracurriculars"
                placeholder="e.g., Student government, volunteer work"
                value={extracurriculars}
                onChange={(e) => setExtracurriculars(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="personalStatement" className="text-sm font-medium">
                Personal Statement Quality (optional)
              </Label>
              <Input
                id="personalStatement"
                placeholder="e.g., Excellent, Good, In progress"
                value={personalStatementQuality}
                onChange={(e) => setPersonalStatementQuality(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleGeneratePrediction}
              disabled={isLoading || !gpa}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Prediction...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Prediction
                </>
              )}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Prediction Results */}
          {prediction && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Overall Readiness Score */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Overall Readiness Score
                  </h3>
                  <span className="text-3xl font-bold text-blue-600">
                    {prediction.overallReadiness}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${prediction.overallReadiness}%` }}
                  />
                </div>
              </div>

              {/* University Predictions */}
              {prediction.universityPredictions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    University-Specific Predictions
                  </h3>
                  <div className="space-y-3">
                    {prediction.universityPredictions.map((uni, index) => (
                      <div
                        key={index}
                        className={`border-2 rounded-lg p-4 ${getLikelihoodColor(uni.likelihood)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{uni.university}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium uppercase">{uni.likelihood}</span>
                            <span className="text-xl font-bold">{uni.percentage}%</span>
                          </div>
                        </div>
                        <p className="text-sm opacity-90">{uni.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {prediction.strengths.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {prediction.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600 font-bold">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for Improvement */}
              {prediction.areasForImprovement.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {prediction.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-orange-600 font-bold">→</span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {prediction.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <LightbulbIcon className="h-5 w-5 text-yellow-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-yellow-600 font-bold">💡</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
