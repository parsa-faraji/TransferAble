import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TimelineClient } from "./timeline-client";

export default async function TimelinePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <TimelineClient />;
}


