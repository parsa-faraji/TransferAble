import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PaymentsClient } from "./payments-client";

export default async function PaymentsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <PaymentsClient />;
}


