import { prisma } from "@/lib/prisma";

export const notificationRepository = {
  findExisting(input: { recipientUserId: string; noteId: string; type: string }) {
    return prisma.notificationEvent.findUnique({
      where: {
        recipientUserId_noteId_type: input
      }
    });
  },

  create(input: { recipientUserId: string; noteId: string; type: string }) {
    return prisma.notificationEvent.create({
      data: input
    });
  }
};

