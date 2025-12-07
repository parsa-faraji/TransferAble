/**
 * Seed script to add Peralta Community Colleges and UC/CSU universities
 * Run with: npx tsx scripts/seed-peralta-colleges.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const peraltaColleges = [
  {
    name: "Berkeley City College",
    code: "BCC",
    city: "Berkeley",
    state: "CA",
  },
  {
    name: "College of Alameda",
    code: "COA",
    city: "Alameda",
    state: "CA",
  },
  {
    name: "Laney College",
    code: "LANEY",
    city: "Oakland",
    state: "CA",
  },
  {
    name: "Merritt College",
    code: "MERRITT",
    city: "Oakland",
    state: "CA",
  },
];

const ucUniversities = [
  { name: "UC Berkeley", code: "UCB", type: "UC" as const, city: "Berkeley" },
  { name: "UCLA", code: "UCLA", type: "UC" as const, city: "Los Angeles" },
  { name: "UC San Diego", code: "UCSD", type: "UC" as const, city: "San Diego" },
  { name: "UC Davis", code: "UCD", type: "UC" as const, city: "Davis" },
  { name: "UC Santa Barbara", code: "UCSB", type: "UC" as const, city: "Santa Barbara" },
  { name: "UC Irvine", code: "UCI", type: "UC" as const, city: "Irvine" },
  { name: "UC Santa Cruz", code: "UCSC", type: "UC" as const, city: "Santa Cruz" },
  { name: "UC Riverside", code: "UCR", type: "UC" as const, city: "Riverside" },
  { name: "UC Merced", code: "UCM", type: "UC" as const, city: "Merced" },
];

const csuUniversities = [
  { name: "San Francisco State", code: "SFSU", type: "CSU" as const, city: "San Francisco" },
  { name: "San Jose State", code: "SJSU", type: "CSU" as const, city: "San Jose" },
  { name: "Cal State East Bay", code: "CSUEB", type: "CSU" as const, city: "Hayward" },
  { name: "Cal State Monterey Bay", code: "CSUMB", type: "CSU" as const, city: "Seaside" },
  { name: "Sonoma State", code: "SSU", type: "CSU" as const, city: "Rohnert Park" },
  { name: "Sacramento State", code: "CSUS", type: "CSU" as const, city: "Sacramento" },
  { name: "Cal Poly San Luis Obispo", code: "CPSLO", type: "CSU" as const, city: "San Luis Obispo" },
  { name: "Cal State Long Beach", code: "CSULB", type: "CSU" as const, city: "Long Beach" },
  { name: "Cal State Fullerton", code: "CSUF", type: "CSU" as const, city: "Fullerton" },
  { name: "Cal State Northridge", code: "CSUN", type: "CSU" as const, city: "Northridge" },
];

async function main() {
  console.log("🌱 Seeding Peralta Community Colleges...");

  // Seed Peralta Colleges
  for (const college of peraltaColleges) {
    await prisma.communityCollege.upsert({
      where: { code: college.code },
      update: college,
      create: college,
    });
    console.log(`✅ Added/Updated: ${college.name}`);
  }

  console.log("\n🌱 Seeding UC Universities...");

  // Seed UC Universities
  for (const university of ucUniversities) {
    await prisma.university.upsert({
      where: { code: university.code },
      update: university,
      create: university,
    });
    console.log(`✅ Added/Updated: ${university.name}`);
  }

  console.log("\n🌱 Seeding CSU Universities...");

  // Seed CSU Universities
  for (const university of csuUniversities) {
    await prisma.university.upsert({
      where: { code: university.code },
      update: university,
      create: university,
    });
    console.log(`✅ Added/Updated: ${university.name}`);
  }

  console.log("\n✨ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

