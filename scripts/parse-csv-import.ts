/**
 * CSV Parser for Articulation Import
 * 
 * Usage: npx tsx scripts/parse-csv-import.ts < path/to/articulations.csv
 */

import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

interface ArticulationRow {
  community_college_code: string;
  course_code: string;
  course_name: string;
  units: string;
  university_code: string;
  equivalent_course_code: string;
  equivalent_course_name: string;
}

function parseCSV(filePath: string): ArticulationRow[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as ArticulationRow[];

  return records;
}

function convertToImportFormat(rows: ArticulationRow[]) {
  return rows.map((row) => ({
    communityCollegeCode: row.community_college_code,
    courseCode: row.course_code,
    courseName: row.course_name,
    units: parseFloat(row.units) || 3,
    universityCode: row.university_code,
    equivalentCourseCode: row.equivalent_course_code,
    equivalentCourseName: row.equivalent_course_name,
  }));
}

async function importFromCSV(filePath: string) {
  console.log(`📄 Parsing CSV: ${filePath}`);
  
  const rows = parseCSV(filePath);
  console.log(`✅ Parsed ${rows.length} rows`);

  const articulations = convertToImportFormat(rows);
  
  // Send to API
  const response = await fetch("http://localhost:3000/api/admin/articulations/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ articulations }),
  });

  const result = await response.json();
  
  if (response.ok) {
    console.log(`\n✨ Import complete!`);
    console.log(`   Imported: ${result.imported}`);
    console.log(`   Errors: ${result.errors}`);
    console.log(`   Total: ${result.total}`);
  } else {
    console.error("❌ Import failed:", result.error);
  }
}

// Run if called directly
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx tsx scripts/parse-csv-import.ts <path/to/file.csv>");
    process.exit(1);
  }
  importFromCSV(filePath).catch(console.error);
}

export { parseCSV, convertToImportFormat };

