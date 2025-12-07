import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ApplicationsClient } from "./applications-client";

export default async function ApplicationsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch actual application data from database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      applications: {
        include: {
          university: true,
          essays: true,
          activities: true,
        },
        orderBy: {
          deadline: "asc",
        },
      },
    },
  });

  const applications = (dbUser?.applications || []).map((app) => {
    const essaysCompleted = app.essays.filter((e) => e.isComplete).length;
    const essaysTotal = app.essays.length;
    const progress = essaysTotal > 0 
      ? Math.round((essaysCompleted / essaysTotal) * 100)
      : app.status === "SUBMITTED" ? 100 : 10;

    return {
      id: app.id,
      universityId: app.universityId,
      university: app.university.name,
      major: app.majorId || "Undeclared",
      status: app.status,
      deadline: app.deadline.toISOString(),
      essaysCompleted,
      essaysTotal,
      progress,
    };
  });

  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      code: true,
      type: true,
      city: true,
      state: true,
    },
  });

  return <ApplicationsClient applications={applications} universities={universities} />;
}

