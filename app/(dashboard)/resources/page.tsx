import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ResourcesClient } from "./resources-client";

export default async function ResourcesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <ResourcesClient />;
}
