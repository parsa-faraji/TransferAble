"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";
// Simple CSV parser for browser
function parseCSV(text: string): ArticulationRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: ArticulationRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      rows.push(row as ArticulationRow);
    }
  }

  return rows;
}

interface ArticulationRow {
  community_college_code: string;
  course_code: string;
  course_name: string;
  units: string;
  university_code: string;
  equivalent_course_code: string;
  equivalent_course_name: string;
}

export function ArticulationsAdminClient() {
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    errors: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setImportResult(null);

    try {
      // Read file
      const text = await file.text();

      // Parse CSV
      const records = parseCSV(text);

      // Convert to import format
      const articulations = records.map((row) => ({
        communityCollegeCode: row.community_college_code,
        courseCode: row.course_code,
        courseName: row.course_name,
        units: parseFloat(row.units) || 3,
        universityCode: row.university_code,
        equivalentCourseCode: row.equivalent_course_code,
        equivalentCourseName: row.equivalent_course_name,
      }));

      // Send to API
      const response = await fetch("/api/admin/articulations/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articulations }),
      });

      const result = await response.json();

      if (response.ok) {
        setImportResult(result);
      } else {
        setError(result.error || "Failed to import articulations");
      }
    } catch (err) {
      console.error("Import error:", err);
      setError("Failed to parse CSV file. Please check the format.");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
BCC,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus
BCC,ENGL 1A,Composition and Reading,3,UCB,ENGL R1A,Reading and Composition
BCC,PHYS 2A,Physics for Scientists and Engineers,4,UCB,PHYSICS 7A,Physics for Scientists and Engineers
LANEY,MATH 1A,Calculus I,4,UCB,MATH 1A,Calculus`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "articulation-import-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Articulation Management</h1>
        <p className="text-gray-600">
          Import and manage course articulations for Peralta Community Colleges
        </p>
      </div>

      {/* Import Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Import from CSV</CardTitle>
          <CardDescription>
            Upload a CSV file with articulation data from ASSIST.org
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Upload CSV file with articulation data
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Format: community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
              </p>
              <div className="flex gap-4 justify-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <Button asChild disabled={uploading}>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploading ? "Uploading..." : "Choose CSV File"}
                  </label>
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </div>

            {uploading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <p className="text-sm text-gray-600 mt-2">Processing and importing...</p>
              </div>
            )}

            {importResult && (
              <div className={`p-4 rounded-lg ${
                importResult.errors > 0 ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-200"
              }`}>
                <div className="flex items-start">
                  <CheckCircle2 className={`h-5 w-5 mr-2 mt-0.5 ${
                    importResult.errors > 0 ? "text-yellow-600" : "text-green-600"
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      importResult.errors > 0 ? "text-yellow-900" : "text-green-900"
                    }`}>
                      Import Complete
                    </p>
                    <div className="text-sm mt-1 space-y-1">
                      <p className={importResult.errors > 0 ? "text-yellow-700" : "text-green-700"}>
                        ✅ Imported: {importResult.imported} articulations
                      </p>
                      {importResult.errors > 0 && (
                        <p className="text-yellow-700">
                          ⚠️ Errors: {importResult.errors} rows failed
                        </p>
                      )}
                      <p className={importResult.errors > 0 ? "text-yellow-700" : "text-green-700"}>
                        📊 Total processed: {importResult.total} rows
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Import Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Fetch Option */}
      <Card className="mb-6 border-primary-200 bg-primary-50">
        <CardHeader>
          <CardTitle>🚀 Quick Fetch from ASSIST.org</CardTitle>
          <CardDescription>
            Automatically download and parse articulation data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" size="lg">
            <a href="/admin/articulations/fetch">
              <Download className="mr-2 h-4 w-4" />
              Fetch from ASSIST.org
            </a>
          </Button>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Select colleges and automatically download articulations
          </p>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Collect Data from ASSIST.org</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Step 1: Go to ASSIST.org</h3>
              <p className="text-sm text-gray-600 mb-2">
                Visit <a href="https://assist.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">assist.org</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Step 2: Navigate to Articulations</h3>
              <p className="text-sm text-gray-600 mb-2">
                Click "Agreements" → "Course-to-Course Articulation"
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Step 3: Select Colleges</h3>
              <p className="text-sm text-gray-600 mb-2">
                Select a Peralta college (BCC, COA, Laney, or Merritt) and a target UC/CSU
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Step 4: Copy Data</h3>
              <p className="text-sm text-gray-600 mb-2">
                Copy the articulation table and paste into Excel/Google Sheets. Format as CSV with these columns:
              </p>
              <code className="block bg-gray-100 p-2 rounded text-xs mt-2">
                community_college_code,course_code,course_name,units,university_code,equivalent_course_code,equivalent_course_name
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Step 5: Import</h3>
              <p className="text-sm text-gray-600">
                Upload your CSV file using the form above
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Reference - College Codes</h4>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-medium text-blue-800">Peralta Colleges:</p>
                <ul className="text-blue-700 space-y-1 mt-1">
                  <li>BCC = Berkeley City College</li>
                  <li>COA = College of Alameda</li>
                  <li>LANEY = Laney College</li>
                  <li>MERRITT = Merritt College</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-blue-800">Popular Universities:</p>
                <ul className="text-blue-700 space-y-1 mt-1">
                  <li>UCB = UC Berkeley</li>
                  <li>UCLA = UCLA</li>
                  <li>UCSD = UC San Diego</li>
                  <li>SFSU = San Francisco State</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

