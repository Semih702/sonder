import { prisma } from "@/lib/prisma";

export const userRepository = {
  createAnonymousUser(now = new Date()) {
    return prisma.user.create({
      data: {
        displayName: "User",
        acceptedTermsAt: now,
        acceptedPrivacyAt: now,
        ageConfirmedAt: now
      }
    });
  },

  findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  },

  banUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isBanned: true }
    });
  }
};

