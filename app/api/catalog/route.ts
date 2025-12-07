import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [communityColleges, universities] = await Promise.all([
      prisma.communityCollege.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, code: true, city: true, state: true },
      }),
      prisma.university.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, code: true, type: true, city: true, state: true },
      }),
    ]);

    return NextResponse.json({ communityColleges, universities });
  } catch (error) {
    console.error("Error loading catalog options:", error);
    return NextResponse.json(
      { error: "Failed to load catalog options" },
      { status: 500 }
    );
  }
}
