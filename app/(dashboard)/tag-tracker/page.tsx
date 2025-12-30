import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TAGTrackerClient } from "./tag-tracker-client";

export default async function TAGTrackerPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <TAGTrackerClient />;
}
