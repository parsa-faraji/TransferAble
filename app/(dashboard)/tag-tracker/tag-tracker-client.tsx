"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, XCircle, AlertTriangle, ExternalLink, Loader2, Award } from "lucide-react";
import Link from "next/link";

interface TagRequirement {
  university: string;
  universityCode: string;
  eligible: boolean;
  requirements: {
    name: string;
    met: boolean;
    current?: number;
    required: number;
    unit?: string;
  }[];
  applicationDeadline?: string;
  notes?: string;
}

export function TAGTrackerClient() {
  const [loading, setLoading] = useState(true);
  const [tagData, setTagData] = useState<TagRequirement[]>([]);

  useEffect(() => {
    loadTAGEligibility();
  }, []);

  const loadTAGEligibility = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profileResponse = await fetch("/api/user/profile");
      if (!profileResponse.ok) return;

      const { profile } = await profileResponse.json();

      // Calculate TAG eligibility for each UC
      const tagEligibility: TagRequirement[] = [];

      // TAG-eligible UCs: Davis, Irvine, Merced, Riverside, Santa Barbara, Santa Cruz
      const tagUniversities = [
        { name: "UC Davis", code: "UCD" },
        { name: "UC Irvine", code: "UCI" },
        { name: "UC Merced", code: "UCM" },
        { name: "UC Riverside", code: "UCR" },
        { name: "UC Santa Barbara", code: "UCSB" },
        { name: "UC Santa Cruz", code: "UCSC" },
      ];

      // Calculate GPA from completed courses (simple average for demo)
      const completedCourses = profile.completedCourses || [];
      let totalGPA = 0;
      let courseCount = 0;

      completedCourses.forEach((completion: any) => {
        const grade = completion.grade;
        if (grade) {
          const gpaValue = gradeToGPA(grade);
          if (gpaValue > 0) {
            totalGPA += gpaValue;
            courseCount++;
          }
        }
      });

      const currentGPA = courseCount > 0 ? totalGPA / courseCount : 0;
      const completedUnits = completedCourses.length * 3; // Assuming 3 units per course

      for (const uni of tagUniversities) {
        // Check if this university is in user's target list
        const isTargeted = profile.targetUniversities?.some(
          (target: any) => target.code === uni.code || target.name === uni.name
        );

        if (!isTargeted) continue;

        const requirements = [
          {
            name: "Minimum GPA",
            met: currentGPA >= 3.4,
            current: parseFloat(currentGPA.toFixed(2)),
            required: 3.4,
            unit: "GPA"
          },
          {
            name: "Completed Units",
            met: completedUnits >= 30,
            current: completedUnits,
            required: 30,
            unit: "units"
          },
          {
            name: "California Community College Student",
            met: true,
            required: 1,
            unit: "requirement"
          },
          {
            name: "Major Preparation Courses",
            met: completedCourses.length >= 5,
            current: completedCourses.length,
            required: 5,
            unit: "courses"
          },
        ];

        const eligible = requirements.every(req => req.met);

        tagEligibility.push({
          university: uni.name,
          universityCode: uni.code,
          eligible,
          requirements,
          applicationDeadline: "September 30, 2025",
          notes: eligible
            ? "You're eligible for TAG! Submit your TAG application by the deadline."
            : "Complete the requirements below to become eligible for TAG."
        });
      }

      setTagData(tagEligibility);
    } catch (error) {
      console.error("Error loading TAG eligibility:", error);
    } finally {
      setLoading(false);
    }
  };

  const gradeToGPA = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0
    };
    return gradeMap[grade.toUpperCase()] || 0;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const eligibleCount = tagData.filter(tag => tag.eligible).length;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">TAG Eligibility Tracker</h1>
        </div>
        <p className="text-gray-600 mb-4">
          Transfer Admission Guarantee (TAG) ensures your admission to participating UCs if you meet the requirements.
        </p>

        {/* Summary Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
          <Award className="h-5 w-5 text-purple-600" />
          <span className="font-semibold text-purple-900">
            Eligible for {eligibleCount} of {tagData.length} TAG programs
          </span>
        </div>
      </div>

      {/* What is TAG Info */}
      <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle>What is TAG?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            TAG (Transfer Admission Guarantee) is a program that guarantees admission to one of six participating UCs
            for California community college students who meet specific requirements.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-purple-900 mb-1">✓ Guaranteed Admission</div>
              <div className="text-gray-600">Meet requirements = confirmed acceptance</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-purple-900 mb-1">✓ Early Decision</div>
              <div className="text-gray-600">Know by January if you're accepted</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-purple-900 mb-1">✓ Priority Support</div>
              <div className="text-gray-600">Counseling & course planning help</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TAG Eligibility Cards */}
      {tagData.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No TAG Universities Selected</h3>
            <p className="text-gray-600 mb-4">
              Add UC Davis, Irvine, Merced, Riverside, Santa Barbara, or Santa Cruz to your target universities to check TAG eligibility.
            </p>
            <Button asChild>
              <Link href="/dashboard">Update Target Universities</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tagData.map((tag, index) => (
            <Card key={index} className={`${tag.eligible ? 'border-2 border-green-500' : 'border-gray-200'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {tag.eligible ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-gray-400" />
                    )}
                    {tag.university}
                  </CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    tag.eligible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tag.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
                <CardDescription>{tag.notes}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {tag.requirements.map((req, reqIndex) => (
                      <div
                        key={reqIndex}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          req.met ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {req.met ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="font-medium text-gray-900">{req.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {req.current !== undefined ? (
                            <span>
                              <span className={req.met ? 'text-green-700 font-semibold' : 'text-gray-700'}>
                                {req.current}
                              </span>
                              {' / '}{req.required} {req.unit}
                            </span>
                          ) : (
                            <span className="text-green-700">✓ Met</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {tag.eligible && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-900 font-semibold mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        Next Steps
                      </div>
                      <ul className="text-sm text-blue-800 space-y-1 ml-7">
                        <li>• Submit TAG application by {tag.applicationDeadline}</li>
                        <li>• Complete UC application by November 30</li>
                        <li>• Maintain your GPA and complete planned courses</li>
                      </ul>
                      <Button
                        asChild
                        className="mt-3 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <a
                          href="https://uctag.universityofcalifornia.edu/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          Apply for TAG
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resources */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>TAG Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 justify-start"
            >
              <a
                href="https://admission.universityofcalifornia.edu/admission-requirements/transfer-requirements/uc-transfer-programs/transfer-admission-guarantee-tag.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Official TAG Information</div>
                  <div className="text-xs text-gray-500">UC Admissions website</div>
                </div>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 justify-start"
            >
              <a
                href="https://uctag.universityofcalifornia.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">TAG Application Portal</div>
                  <div className="text-xs text-gray-500">Submit your TAG application</div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
