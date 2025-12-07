"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/sign-in" className="text-gray-600 hover:text-gray-900">
        Sign In
      </Link>
      <Button asChild>
        <Link href="/sign-up">Get Started</Link>
      </Button>
    </div>
  );
}

