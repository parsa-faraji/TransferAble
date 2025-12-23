import { prisma } from "./prisma";

type ClerkLikeUser = {
  id: string;
  emailAddresses?: { emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};

function resolveEmail(user: ClerkLikeUser): string {
  return (
    user.emailAddresses?.[0]?.emailAddress ||
    `${user.id}@placeholder.transferable.app`
  );
}

/**
 * Ensure we have a corresponding Prisma user for a Clerk user.
 * Updates basic profile fields when they change.
 */
export async function ensureUserRecord(user: ClerkLikeUser) {
  const email = resolveEmail(user);

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        profileImage: user.imageUrl || null,
      },
    });

    return dbUser;
  }

  const updates: Record<string, string | null> = {};

  if (email && dbUser.email !== email) {
    updates.email = email;
  }
  if (user.firstName && user.firstName !== dbUser.firstName) {
    updates.firstName = user.firstName;
  }
  if (user.lastName && user.lastName !== dbUser.lastName) {
    updates.lastName = user.lastName;
  }
  if (user.imageUrl && user.imageUrl !== dbUser.profileImage) {
    updates.profileImage = user.imageUrl;
  }

  if (Object.keys(updates).length > 0) {
    dbUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: updates,
    });
  }

  return dbUser;
}
