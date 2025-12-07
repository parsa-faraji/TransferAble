"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Loader2,
  TrendingUp,
  AlertCircle,
  Plus,
  CalendarClock,
  ListChecks,
  Trash2
} from "lucide-react";

type ManualCourse = {
  ccCourseCode: string;
  ccCourseName: string;
  ucCourseCode?: string;
  ucCourseName?: string;
  units?: number;
  isPrerequisite?: boolean;
};

type ManualCourseForm = {
  ccCourseCode: string;
  ccCourseName: string;
  ucCourseCode: string;
  ucCourseName: string;
  units: string;
  isPrerequisite: boolean;
};

const defaultManualCourseForm: ManualCourseForm = {
  ccCourseCode: "",
  ccCourseName: "",
  ucCourseCode: "",
  ucCourseName: "",
  units: "",
  isPrerequisite: false,
};

const getDefaultStartDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getTargetTransferTerm = (startDate?: string) => {
  const parsedStart = startDate ? new Date(startDate) : new Date();
  const safeStart = isNaN(parsedStart.getTime()) ? new Date() : parsedStart;
  const month = safeStart.getMonth();
  const year = safeStart.getFullYear();
  const targetYear = month < 8 ? year + 1 : year + 2;
  return `Fall ${targetYear}`;
};

const buildSemesterPlanClient = (courses: any[], startDate?: string) => {
  if (!courses || courses.length === 0) return [];

  const parsedStart = startDate ? new Date(startDate) : new Date();
  const start = isNaN(parsedStart.getTime()) ? new Date() : parsedStart;
  const termOrder = ["Spring", "Summer", "Fall"] as const;
  const startTermIndex = start.getMonth() >= 7 ? 2 : start.getMonth() >= 4 ? 1 : 0;

  // Sort courses to prioritize prerequisites and sequences
  const sortedCourses = [...courses].sort((a, b) => {
    // Prerequisites first
    if (a.isPrerequisite && !b.isPrerequisite) return -1;
    if (!a.isPrerequisite && b.isPrerequisite) return 1;

    // Then by sequence (lower sequence numbers first)
    if (a.sequence && b.sequence) {
      const seqA = parseInt(a.sequence) || 999;
      const seqB = parseInt(b.sequence) || 999;
      if (seqA !== seqB) return seqA - seqB;
    }

    // Required courses before electives
    if (a.isRequired && !b.isRequired) return -1;
    if (!a.isRequired && b.isRequired) return 1;

    // Higher unit courses first (more substantial courses)
    const unitsA = Number(a.units) || 3;
    const unitsB = Number(b.units) || 3;
    return unitsB - unitsA;
  });

  let currentTerm = { name: termOrder[startTermIndex], year: start.getFullYear() };
  const plan = [];
  const scheduledCourses = new Set<string>();

  let idx = 0;
  const maxIterations = 20; // Prevent infinite loops
  let iterations = 0;

  while (idx < sortedCourses.length && iterations < maxIterations) {
    iterations++;
    let termUnits = 0;
    const termCourses: any[] = [];
    const MIN_UNITS = 12;
    const MAX_UNITS = 15;

    // Try to fill the semester optimally
    for (let i = idx; i < sortedCourses.length; i++) {
      const course = sortedCourses[i];
      if (scheduledCourses.has(course.ccCourseCode)) continue;

      const units = Number(course.units) || 3;
      const newTotal = termUnits + units;

      // Skip if it would exceed max units (unless we have very few units)
      if (newTotal > MAX_UNITS && termUnits >= MIN_UNITS) continue;

      // Add course to term
      termCourses.push({ ...course, term: `${currentTerm.name} ${currentTerm.year}` });
      scheduledCourses.add(course.ccCourseCode);
      termUnits += units;

      // Stop if we've reached optimal load
      if (termUnits >= MIN_UNITS && termUnits <= MAX_UNITS) break;
    }

    // Only add semester if it has courses
    if (termCourses.length > 0) {
      plan.push({
        term: `${currentTerm.name} ${currentTerm.year}`,
        totalUnits: termUnits,
        courses: termCourses
      });
    }

    // Update index to skip scheduled courses
    while (idx < sortedCourses.length && scheduledCourses.has(sortedCourses[idx].ccCourseCode)) {
      idx++;
    }

    // Move to next term
    const nextIndex = (termOrder.indexOf(currentTerm.name as typeof termOrder[number]) + 1) % termOrder.length;
    const nextYear = nextIndex === 0 ? currentTerm.year + 1 : currentTerm.year;
    currentTerm = { name: termOrder[nextIndex], year: nextYear };
  }

  return plan;
};

export function EducationPlanClient() {
  const [plan, setPlan] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [majorInput, setMajorInput] = useState("");
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [manualCourses, setManualCourses] = useState<ManualCourse[]>([]);
  const [manualCourseForm, setManualCourseForm] = useState<ManualCourseForm>(defaultManualCourseForm);
  const [checkedCourses, setCheckedCourses] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [profileWarning, setProfileWarning] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileDefaults = async () => {
      try {
        const profileResponse = await fetch("/api/user/profile");
        if (!profileResponse.ok) return;
        const profileData = await profileResponse.json();
        const profile = profileData.profile;
        if (profile?.currentMajor) {
          setMajorInput(profile.currentMajor);
        }
        if (Array.isArray(profile?.completedCourseCodes)) {
          setCheckedCourses(new Set(profile.completedCourseCodes));
        }
      } catch {
        // Best-effort preload; fall back to manual entry
      }
    };

    loadProfileDefaults();
  }, []);

  const completionSet = useMemo(() => new Set(checkedCourses), [checkedCourses]);
  const requiredCourses = plan?.plan?.required || [];
  const completedCourses = useMemo(
    () => requiredCourses.filter((course: any) => completionSet.has(course.ccCourseCode)),
    [requiredCourses, completionSet]
  );
  const remainingCourses = useMemo(
    () => requiredCourses.filter((course: any) => !completionSet.has(course.ccCourseCode)),
    [requiredCourses, completionSet]
  );

  const recommendedCourses = useMemo(() => {
    const fromApi = plan?.plan?.recommended || [];
    const filtered = fromApi.filter((course: any) => !completionSet.has(course.ccCourseCode));
    if (filtered.length > 0) return filtered.slice(0, 5);
    return remainingCourses.slice(0, 5);
  }, [plan, completionSet, remainingCourses]);

  const semesterPlan = useMemo(
    () => buildSemesterPlanClient(remainingCourses, startDate),
    [remainingCourses, startDate]
  );

  const summary = {
    totalRequired: requiredCourses.length,
    completed: completedCourses.length,
    remaining: remainingCourses.length,
    progressPercent: requiredCourses.length
      ? Math.round((completedCourses.length / requiredCourses.length) * 100)
      : 0
  };

  const handleAddManualCourse = () => {
    if (!manualCourseForm.ccCourseCode || !manualCourseForm.ccCourseName) {
      setStatusMessage("Add both the community college course code and name.");
      return;
    }

    setManualCourses((prev) => [
      ...prev,
      {
        ccCourseCode: manualCourseForm.ccCourseCode.trim(),
        ccCourseName: manualCourseForm.ccCourseName.trim(),
        ucCourseCode: manualCourseForm.ucCourseCode.trim() || manualCourseForm.ccCourseCode.trim(),
        ucCourseName: manualCourseForm.ucCourseName.trim() || manualCourseForm.ccCourseName.trim(),
        units: manualCourseForm.units ? Number(manualCourseForm.units) : undefined,
        isPrerequisite: manualCourseForm.isPrerequisite,
      },
    ]);
    setManualCourseForm(defaultManualCourseForm);
    setStatusMessage(null);
  };

  const handleRemoveManualCourse = (index: number) => {
    setManualCourses((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleCourseCompletion = (code: string) => {
    setCheckedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const generatePlan = async () => {
    setStatusMessage(null);
    setProfileWarning(null);

    if (!majorInput.trim()) {
      setStatusMessage("Enter your major so we can pull the right requirements.");
      return;
    }

    setGenerating(true);
    try {
      const profileResponse = await fetch("/api/user/profile");
      if (!profileResponse.ok) {
        setStatusMessage("Please sign in to generate your education plan.");
        return;
      }

      const profileData = await profileResponse.json();
      const profile = profileData.profile;
      if (!profile || !profile.communityCollege || !profile.targetUniversities || profile.targetUniversities.length === 0) {
        setProfileWarning("Finish onboarding by selecting your community college and target universities.");
        return;
      }

      const response = await fetch("/api/education-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityCollegeId: profile.communityCollege.id,
          universityIds: profile.targetUniversities.map((u: any) => u.id),
          majorIds: profile.major ? [profile.major.id] : [],
          majorQuery: majorInput.trim(),
          manualCourses,
          completedCourseCodes: Array.from(completionSet),
          targetTransferTerm: getTargetTransferTerm(startDate),
          startDate,
          maxUnitsPerTerm: 15
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPlan(data);
        setCheckedCourses(new Set([
          ...Array.from(completionSet),
          ...((data.plan?.completed || []).map((course: any) => course.ccCourseCode))
        ]));
      } else {
        setStatusMessage("Could not generate plan. Try again or update your profile.");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      setStatusMessage("Something went wrong while generating your plan.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Education Plan</h1>
          <p className="text-gray-600">
            Enter your major, add any missing courses, and generate a semester-by-semester roadmap.
          </p>
        </div>
        <Button 
          onClick={generatePlan} 
          disabled={generating}
          size="lg"
          className="flex items-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Plan
            </>
          )}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Plan Setup
          </CardTitle>
          <CardDescription>Tell us your major, start term, and any custom courses to include.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Major</label>
              <input
                type="text"
                value={majorInput}
                onChange={(e) => setMajorInput(e.target.value)}
                placeholder="e.g., Computer Science"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-4 w-4 text-primary-600" />
              <p className="text-sm font-medium text-gray-800">Add a course that is missing</p>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              <input
                type="text"
                value={manualCourseForm.ccCourseCode}
                onChange={(e) => setManualCourseForm({ ...manualCourseForm, ccCourseCode: e.target.value })}
                placeholder="CC code"
                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <input
                type="text"
                value={manualCourseForm.ccCourseName}
                onChange={(e) => setManualCourseForm({ ...manualCourseForm, ccCourseName: e.target.value })}
                placeholder="CC course name"
                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <input
                type="text"
                value={manualCourseForm.ucCourseCode}
                onChange={(e) => setManualCourseForm({ ...manualCourseForm, ucCourseCode: e.target.value })}
                placeholder="Univ. code (optional)"
                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <input
                type="text"
                value={manualCourseForm.ucCourseName}
                onChange={(e) => setManualCourseForm({ ...manualCourseForm, ucCourseName: e.target.value })}
                placeholder="Univ. course name (optional)"
                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={manualCourseForm.units}
                  onChange={(e) => setManualCourseForm({ ...manualCourseForm, units: e.target.value })}
                  placeholder="Units"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={manualCourseForm.isPrerequisite}
                    onChange={(e) => setManualCourseForm({ ...manualCourseForm, isPrerequisite: e.target.checked })}
                    className="h-4 w-4 text-primary-600"
                  />
                  Prereq
                </label>
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddManualCourse}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add course
              </Button>
              <p className="text-xs text-gray-500">
                Missing a class? Add it here before generating and we'll include it in your plan.
              </p>
            </div>

            {manualCourses.length > 0 && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {manualCourses.map((course, idx) => (
                  <div
                    key={`${course.ccCourseCode}-${idx}`}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {course.ccCourseCode} → {course.ucCourseCode || course.ccCourseCode}
                      </p>
                      <p className="text-xs text-gray-600">
                        {course.ccCourseName} {course.ucCourseName ? `→ ${course.ucCourseName}` : ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.units ? `${course.units} units · ` : ""}{course.isPrerequisite ? "Prerequisite" : "Elective/GE"}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleRemoveManualCourse(idx)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {statusMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {profileWarning && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <span>{profileWarning}</span>
        </div>
      )}

      {!plan ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generate Your Education Plan
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter your major, pick a start date, and we'll surface the courses you need. Add or remove courses, mark completed ones, and get a semester-by-semester plan.
              </p>
              <Button 
                onClick={generatePlan} 
                disabled={generating}
                size="lg"
                className="flex items-center gap-2 mx-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Education Plan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary-600">
                  {summary.progressPercent}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Complete</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.totalRequired}</div>
                <p className="text-xs text-gray-500 mt-1">Total courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {summary.completed}
                </div>
                <p className="text-xs text-gray-500 mt-1">Finished</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {summary.remaining}
                </div>
                <p className="text-xs text-gray-500 mt-1">To complete</p>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Next Courses */}
          {recommendedCourses.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommended Next Courses
                </CardTitle>
                <CardDescription>
                  Suggested courses to take next based on prerequisites and sequencing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendedCourses.slice(0, 5).map((course: any, idx: number) => (
                    <div
                      key={`${course.ccCourseCode}-${idx}`}
                      className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{course.ccCourseCode}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-semibold">{course.ucCourseCode}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {course.ccCourseName} → {course.ucCourseName}
                          </p>
                          {course.isPrerequisite && (
                            <span className="text-xs text-orange-600 mt-1 inline-block">
                              Prerequisite for other courses
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{course.units} units</div>
                        {course.sequence && (
                          <div className="text-xs text-gray-500">Sequence: {course.sequence}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Semester Plan */}
          {semesterPlan.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" />
                  Plan by Semester
                </CardTitle>
                <CardDescription>
                  Sequenced from your start date. Adjust completed courses and regenerate to update.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {semesterPlan.map((term: any) => (
                    <div key={term.term} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{term.term}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {term.totalUnits} units
                        </span>
                      </div>
                      <div className="space-y-2">
                        {term.courses.map((course: any) => (
                          <div key={`${course.ccCourseCode}-${course.ucCourseCode}`} className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {course.ccCourseCode} → {course.ucCourseCode}
                              </p>
                              <p className="text-xs text-gray-600">
                                {course.ccCourseName} → {course.ucCourseName}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Courses with checkboxes */}
          <Card>
            <CardHeader>
              <CardTitle>All Courses for {majorInput || "your major"}</CardTitle>
              <CardDescription>
                Check off what you've finished. We'll recalculate progress and semesters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requiredCourses.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No courses found yet. Try regenerating with a different major.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requiredCourses.map((course: any) => {
                    const isDone = completionSet.has(course.ccCourseCode);
                    return (
                      <div
                        key={`${course.ccCourseCode}-${course.ucCourseCode}`}
                        className={`flex items-start justify-between p-4 border rounded-lg ${isDone ? "border-green-200 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleCourseCompletion(course.ccCourseCode)}
                            className="mt-1 h-4 w-4 text-primary-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{course.ccCourseCode}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-semibold">{course.ucCourseCode}</span>
                              {course.isRequired && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                  Required
                                </span>
                              )}
                              {course.isPrerequisite && (
                                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                  Prerequisite
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {course.ccCourseName} → {course.ucCourseName}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{course.units} units</span>
                              {course.sequence && <span>Sequence: {course.sequence}</span>}
                            </div>
                            {course.notes && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                                {course.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          {isDone ? (
                            <div className="flex items-center gap-1 text-green-700 font-medium">
                              <CheckCircle2 className="h-4 w-4" />
                              Completed
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-orange-600 font-medium">
                              <Clock className="h-4 w-4" />
                              Pending
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end gap-3">
            <Button onClick={() => setCheckedCourses(new Set())} variant="ghost">
              Clear checkboxes
            </Button>
            <Button onClick={generatePlan} variant="outline" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Regenerate Plan
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
