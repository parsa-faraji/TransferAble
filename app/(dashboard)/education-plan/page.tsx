import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EducationPlanClient } from "./education-plan-client";

export default async function EducationPlanPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <EducationPlanClient />;
}










