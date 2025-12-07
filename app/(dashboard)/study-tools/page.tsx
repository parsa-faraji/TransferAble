import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StudyToolsClient } from "./study-tools-client";

export default async function StudyToolsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <StudyToolsClient />;
}
