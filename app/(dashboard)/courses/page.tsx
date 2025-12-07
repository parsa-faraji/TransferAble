import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesClient } from "./courses-client";

export default async function CoursesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <CoursesClient />;
}


