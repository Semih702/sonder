import { prisma } from "@/lib/prisma";

export const reportRepository = {
  async createIfAbsent(input: { noteId: string; reporterUserId: string; reason?: string }) {
    try {
      const report = await prisma.report.create({
        data: input
      });

      return { created: true, report };
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        const report = await prisma.report.findUnique({
          where: {
            noteId_reporterUserId: {
              noteId: input.noteId,
              reporterUserId: input.reporterUserId
            }
          }
        });

        return { created: false, report };
      }

      throw error;
    }
  },

  listRecent() {
    return prisma.report.findMany({
      include: {
        note: true,
        reporter: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 100
    });
  }
};

