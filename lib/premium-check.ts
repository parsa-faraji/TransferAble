import { prisma } from "./prisma";

/**
 * Check if a user has premium subscription
 */
export async function checkPremiumAccess(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { subscriptionTier: true },
    });

    return user?.subscriptionTier === "PREMIUM";
  } catch (error) {
    console.error("Error checking premium access:", error);
    return false;
  }
}

/**
 * Middleware to require premium access
 */
export async function requirePremium(userId: string): Promise<{ hasAccess: boolean; error?: string }> {
  const hasAccess = await checkPremiumAccess(userId);
  
  if (!hasAccess) {
    return {
      hasAccess: false,
      error: "Premium subscription required. Upgrade to access AI features and premium tools.",
    };
  }

  return { hasAccess: true };
}




