"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Plus, X, GraduationCap, BookOpen, University, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { UniversityImage } from "@/components/ui/university-image";

interface Course {
  code: string;
  name: string;
}

interface CollegeOption {
  id: string;
  name: string;
  code: string;
}

interface UniversityOption {
  id: string;
  name: string;
  code: string;
  type?: string;
}

const FALLBACK_COLLEGES: CollegeOption[] = [
  { id: "bcc", name: "Berkeley City College", code: "BCC" },
  { id: "coa", name: "College of Alameda", code: "COA" },
  { id: "laney", name: "Laney College", code: "LANEY" },
  { id: "merritt", name: "Merritt College", code: "MERRITT" },
];

const FALLBACK_UNIVERSITIES: UniversityOption[] = [
  { id: "ucb", name: "UC Berkeley", code: "UCB", type: "UC" },
  { id: "ucla", name: "UCLA", code: "UCLA", type: "UC" },
  { id: "ucsd", name: "UC San Diego", code: "UCSD", type: "UC" },
  { id: "ucd", name: "UC Davis", code: "UCD", type: "UC" },
  { id: "ucsb", name: "UC Santa Barbara", code: "UCSB", type: "UC" },
  { id: "uci", name: "UC Irvine", code: "UCI", type: "UC" },
  { id: "ucsc", name: "UC Santa Cruz", code: "UCSC", type: "UC" },
  { id: "ucr", name: "UC Riverside", code: "UCR", type: "UC" },
  { id: "ucm", name: "UC Merced", code: "UCM", type: "UC" },
  { id: "sfsu", name: "San Francisco State", code: "SFSU", type: "CSU" },
  { id: "sjsu", name: "San Jose State", code: "SJSU", type: "CSU" },
  { id: "csueb", name: "Cal State East Bay", code: "CSUEB", type: "CSU" },
];

const MAJORS = [
  "Computer Science",
  "Engineering",
  "Business Administration",
  "Biology",
  "Psychology",
  "Political Science",
  "Economics",
  "Mathematics",
  "Chemistry",
  "Physics",
  "Other",
];

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    communityCollegeCode: "",
    major: "",
    targetUniversityIds: [] as string[],
    completedCourses: [] as Course[],
  });
  const [newCourse, setNewCourse] = useState({ code: "", name: "" });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [communityColleges, setCommunityColleges] = useState<CollegeOption[]>(FALLBACK_COLLEGES);
  const [universities, setUniversities] = useState<UniversityOption[]>(FALLBACK_UNIVERSITIES);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await fetch("/api/catalog");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.communityColleges) && data.communityColleges.length > 0) {
            setCommunityColleges(data.communityColleges);
          }
          if (Array.isArray(data.universities) && data.universities.length > 0) {
            setUniversities(data.universities);
          }
        }
      } catch (error) {
        console.error("Failed to load catalog options:", error);
        // Keep fallback lists so users can still onboard
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const handleNext = () => {
    if (step < 4) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsTransitioning(false);
      }, 200);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const addCourse = () => {
    if (newCourse.code.trim() && newCourse.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        completedCourses: [...prev.completedCourses, { ...newCourse }],
      }));
      setNewCourse({ code: "", name: "" });
    }
  };

  const removeCourse = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      completedCourses: prev.completedCourses.filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCourse();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          communityCollegeCode: formData.communityCollegeCode,
          major: formData.major,
          targetUniversityIds: formData.targetUniversityIds,
          completedCourses: formData.completedCourses.map((c) => `${c.code}: ${c.name}`),
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error);
    }
  };

  const toggleUniversity = (universityId: string) => {
    setFormData((prev) => ({
      ...prev,
      targetUniversityIds: prev.targetUniversityIds.includes(universityId)
        ? prev.targetUniversityIds.filter((id) => id !== universityId)
        : [...prev.targetUniversityIds, universityId],
    }));
  };

  const stepIcons = [GraduationCap, BookOpen, University, CheckCircle2];

  const stepTitles = [
    "Select your community college",
    "Choose your intended major",
    "Select your target universities",
    "Add completed courses (optional)",
  ];

  const isStepDisabled = () => {
    if (step === 1) return !formData.communityCollegeCode;
    if (step === 2) return !formData.major;
    if (step === 3) return formData.targetUniversityIds.length === 0;
    return false;
  };

  const resolveCollegeValue = (cc: CollegeOption) => (cc.code || cc.id || "").toUpperCase();
  const resolveUniversityValue = (uni: UniversityOption) => uni.id || uni.code;

  return (
    <div className="relative">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 relative z-10 bg-white",
                  step >= s
                    ? "border-purple-500 bg-purple-500 text-white scale-110 shadow-lg"
                    : "border-gray-300 text-gray-400"
                )}
              >
                {step > s ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <>
                    {stepIcons[s - 1] === GraduationCap && <GraduationCap className="h-5 w-5" />}
                    {stepIcons[s - 1] === BookOpen && <BookOpen className="h-5 w-5" />}
                    {stepIcons[s - 1] === University && <University className="h-5 w-5" />}
                    {stepIcons[s - 1] === CheckCircle2 && <CheckCircle2 className="h-5 w-5" />}
                  </>
                )}
              </div>
              {s < 4 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 transition-all duration-500",
                    step > s ? "bg-purple-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Step {step} of 4</h3>
          <p className="text-sm text-gray-500">{stepTitles[step - 1]}</p>
        </div>
      </div>

      <Card className="overflow-hidden border-2 border-purple-100 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {step === 1 && "🏫 Where are you studying?"}
              {step === 2 && "📚 What's your major?"}
              {step === 3 && "🎓 Dream universities?"}
              {step === 4 && "✨ Your completed courses"}
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 mt-2">
            {loadingOptions && "Loading real college options..."}
            {!loadingOptions && stepTitles[step - 1]}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div
            className={cn("transition-all duration-300", isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100")}
          >
            {/* Step 1: Community College */}
            {step === 1 && (
              <div className="space-y-3">
                <div className="grid gap-3">
                  {communityColleges.map((cc, index) => {
                    const value = resolveCollegeValue(cc);
                    return (
                      <button
                        key={cc.id || cc.code}
                        onClick={() => setFormData({ ...formData, communityCollegeCode: value })}
                        className={cn(
                          "p-4 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]",
                          "hover:shadow-md flex items-center space-x-4 group",
                          formData.communityCollegeCode === value
                            ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md scale-[1.02]"
                            : "border-gray-200 hover:border-purple-300 bg-white"
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                        disabled={loadingOptions}
                      >
                        <UniversityImage
                          name={cc.name}
                          size="md"
                          className="flex-shrink-0"
                          animated={true}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">{cc.name}</div>
                          {formData.communityCollegeCode === value && (
                            <div className="mt-1 text-sm text-purple-600 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              Selected
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Major */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="grid gap-3">
                  {MAJORS.map((major, index) => (
                    <button
                      key={major}
                      onClick={() => setFormData({ ...formData, major })}
                      className={cn(
                        "p-4 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]",
                        "hover:shadow-md",
                        formData.major === major
                          ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md scale-[1.02]"
                          : "border-gray-200 hover:border-purple-300 bg-white"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="font-semibold text-gray-800">{major}</div>
                      {formData.major === major && (
                        <div className="mt-1 text-sm text-purple-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Target Universities */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Select all universities you're interested in transferring to:</p>
                <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                  {universities.map((university, index) => {
                    const value = resolveUniversityValue(university);
                    return (
                      <button
                        key={university.id || university.code}
                        onClick={() => toggleUniversity(value)}
                        className={cn(
                          "p-4 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]",
                          "hover:shadow-md flex items-center space-x-4 group",
                          formData.targetUniversityIds.includes(value)
                            ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md scale-[1.02]"
                            : "border-gray-200 hover:border-purple-300 bg-white"
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                        disabled={loadingOptions}
                      >
                        <UniversityImage
                          name={university.name}
                          size="md"
                          className="flex-shrink-0"
                          animated={true}
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">{university.name}</div>
                            <div className="text-sm text-gray-500 mt-1">{university.type || university.code}</div>
                          </div>
                          {formData.targetUniversityIds.includes(value) && <CheckCircle2 className="h-5 w-5 text-purple-500 flex-shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formData.targetUniversityIds.length > 0 && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-700">
                      ✨ {formData.targetUniversityIds.length} university
                      {formData.targetUniversityIds.length !== 1 ? "ies" : ""} selected
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Completed Courses */}
            {step === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Add courses you've already completed. This helps us create a more accurate course plan! 🎯
                </p>

                {/* Add Course Form */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                      <input
                        type="text"
                        value={newCourse.code}
                        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., MATH 3A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                      <input
                        type="text"
                        value={newCourse.name}
                        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., Calculus I"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addCourse}
                    disabled={!newCourse.code.trim() || !newCourse.name.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Course
                  </Button>
                </div>

                {/* Course List */}
                {formData.completedCourses.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {formData.completedCourses.map((course, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white border-2 border-purple-200 rounded-lg flex items-center justify-between group hover:shadow-md transition-all transform hover:scale-[1.02]"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{course.code}</div>
                          <div className="text-sm text-gray-600">{course.name}</div>
                        </div>
                        <button
                          onClick={() => removeCourse(index)}
                          className="ml-3 p-1 text-red-500 hover:bg-red-50 rounded-full transition-all transform hover:scale-110 active:scale-95"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-purple-300 rounded-xl text-center bg-purple-50/50">
                    <BookOpen className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No courses added yet</p>
                    <p className="text-sm text-gray-400 mt-1">You can skip this step and add courses later</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isStepDisabled()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 4 ? (
                <>
                  Complete Setup
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
