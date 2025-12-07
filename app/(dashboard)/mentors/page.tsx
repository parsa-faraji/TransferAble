import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MentorsClient } from "./mentors-client";

export default async function MentorsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <MentorsClient />;
}


