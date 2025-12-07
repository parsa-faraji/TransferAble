import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HomeworkHelpClient } from "./homework-help-client";
import { requirePremium } from "@/lib/premium-check";

export default async function HomeworkHelpPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const premiumCheck = await requirePremium(user.id);
  if (!premiumCheck.hasAccess) {
    redirect("/payments");
  }

  return <HomeworkHelpClient />;
}


