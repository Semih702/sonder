import { prisma } from "@/lib/prisma";

export const inviteRepository = {
  findByCode(code: string) {
    return prisma.inviteCode.findUnique({
      where: { code }
    });
  },

  consume(id: string) {
    return prisma.inviteCode.update({
      where: { id },
      data: {
        usedCount: {
          increment: 1
        }
      }
    });
  }
};

