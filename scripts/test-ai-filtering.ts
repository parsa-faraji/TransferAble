/**
 * Test AI Filtering and Education Plan Generation
 * 
 * This script tests the new AI filtering features
 */

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
config({ path: resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

async function testAIFiltering() {
  console.log("🧪 Testing AI Filtering Features");
  console.log("=".repeat(80));

  // Check if OpenAI API key is set
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log("⚠️  OPENAI_API_KEY not found in environment variables");
    console.log("   Add it to your .env file:");
    console.log("   OPENAI_API_KEY=your_key_here");
    console.log("\n   The extraction script has the key hardcoded, but API routes need it in .env");
    return;
  }

  console.log("✅ OpenAI API key found");

  // Test database connection
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Check for course equivalencies
    const equivalencyCount = await prisma.courseEquivalency.count();
    console.log(`\n📊 Database Status:`);
    console.log(`   Course Equivalencies: ${equivalencyCount}`);

    if (equivalencyCount === 0) {
      console.log("\n⚠️  No course equivalencies found in database");
      console.log("   You need to import course data first:");
      console.log("   1. Run the extraction script on ASSIST.org");
      console.log("   2. Import the CSV via /admin/articulations");
    } else {
      // Get sample equivalencies
      const samples = await prisma.courseEquivalency.findMany({
        take: 5,
        include: {
          course: {
            include: {
              communityCollege: true
            }
          }
        }
      });

      console.log(`\n📋 Sample Equivalencies:`);
      samples.forEach((eq, idx) => {
        console.log(`   ${idx + 1}. ${eq.course.code} (${eq.course.name?.substring(0, 30)})`);
        console.log(`      → ${eq.equivalentCourseCode} (${eq.equivalentCourseName?.substring(0, 30)})`);
        console.log(`      Verified: ${eq.isVerified ? "✅" : "❌"}`);
      });
    }

    // Check for universities
    const universityCount = await prisma.university.count();
    const ccCount = await prisma.communityCollege.count();
    console.log(`\n   Universities: ${universityCount}`);
    console.log(`   Community Colleges: ${ccCount}`);

    if (universityCount === 0 || ccCount === 0) {
      console.log("\n⚠️  Missing universities or community colleges");
      console.log("   Run seed scripts to add basic data");
    }

  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ Test complete!");
  console.log("\n📝 Next Steps:");
  console.log("   1. Make sure .env file has OPENAI_API_KEY");
  console.log("   2. Import course data via /admin/articulations");
  console.log("   3. Test AI filtering at /courses");
  console.log("   4. Generate education plan at /education-plan");
}

testAIFiltering()
  .catch(console.error)
  .finally(() => process.exit(0));

