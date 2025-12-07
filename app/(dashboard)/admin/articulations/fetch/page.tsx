"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const COLLEGES = [
  { code: "BCC", name: "Berkeley City College" },
  { code: "COA", name: "College of Alameda" },
  { code: "LANEY", name: "Laney College" },
  { code: "MERRITT", name: "Merritt College" },
];

const UNIVERSITIES = [
  { code: "UCB", name: "UC Berkeley", type: "UC" },
  { code: "UCLA", name: "UCLA", type: "UC" },
  { code: "UCSD", name: "UC San Diego", type: "UC" },
  { code: "UCD", name: "UC Davis", type: "UC" },
  { code: "UCSB", name: "UC Santa Barbara", type: "UC" },
  { code: "UCI", name: "UC Irvine", type: "UC" },
  { code: "UCSC", name: "UC Santa Cruz", type: "UC" },
  { code: "UCR", name: "UC Riverside", type: "UC" },
  { code: "UCM", name: "UC Merced", type: "UC" },
  { code: "SFSU", name: "San Francisco State", type: "CSU" },
  { code: "SJSU", name: "San Jose State", type: "CSU" },
  { code: "CSUEB", name: "Cal State East Bay", type: "CSU" },
];

export default function FetchArticulationsPage() {
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    count?: number;
    fileUrl?: string;
    error?: string;
  } | null>(null);

  const handleFetch = async () => {
    if (!selectedCollege || !selectedUniversity) {
      alert("Please select both a college and university");
      return;
    }

    setFetching(true);
    setResult(null);

    try {
      const response = await fetch(
        `/api/admin/articulations/fetch?college=${selectedCollege}&university=${selectedUniversity}`
      );

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          count: data.count,
          fileUrl: data.fileUrl,
        });
      } else {
        setResult({
          success: false,
          error: data.error || "Failed to fetch articulations",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult({
        success: false,
        error: "An error occurred while fetching data",
      });
    } finally {
      setFetching(false);
    }
  };

  const handleDownload = () => {
    if (result?.fileUrl) {
      window.open(result.fileUrl, "_blank");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fetch from ASSIST.org</h1>
        <p className="text-gray-600">
          Automatically download and parse articulation data from ASSIST.org
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Colleges</CardTitle>
          <CardDescription>Choose the source and destination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From (Community College)
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={fetching}
              >
                <option value="">Select college...</option>
                {COLLEGES.map((college) => (
                  <option key={college.code} value={college.code}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To (University)
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={fetching}
              >
                <option value="">Select university...</option>
                {UNIVERSITIES.map((uni) => (
                  <option key={uni.code} value={uni.code}>
                    {uni.name} ({uni.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleFetch}
            disabled={!selectedCollege || !selectedUniversity || fetching}
            className="w-full mt-6"
            size="lg"
          >
            {fetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching from ASSIST.org...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Fetch Articulations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className={result.success ? "border-green-200" : "border-red-200"}>
          <CardContent className="pt-6">
            {result.success ? (
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span className="font-medium">Successfully fetched articulations!</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Found {result.count} articulations</p>
                </div>
                {result.fileUrl && (
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                    <Button asChild>
                      <a href="/admin/articulations">Import to Database</a>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Fetch Failed</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{result.error}</p>
                  <p className="mt-2">
                    💡 Try manually collecting from{" "}
                    <a
                      href="https://assist.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      ASSIST.org
                    </a>{" "}
                    and using the CSV import instead.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              1. Select a Peralta college and target university above
            </p>
            <p>
              2. Click "Fetch Articulations" to download data from ASSIST.org
            </p>
            <p>
              3. The data will be automatically parsed and converted to CSV format
            </p>
            <p>
              4. Download the CSV file or import directly to your database
            </p>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> ASSIST.org may have rate limits or require adjustments
              to the parsing logic. If automatic fetching fails, use the manual CSV import
              method instead.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

