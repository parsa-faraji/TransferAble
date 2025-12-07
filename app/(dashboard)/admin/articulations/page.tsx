import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticulationsAdminClient } from "./page-client";

export default async function ArticulationsAdminPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const dbUser = await prisma.user.findUnique({ 
    where: { clerkId: user.id } 
  });
  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <ArticulationsAdminClient />;
}

