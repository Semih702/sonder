import { boundingBox, type Coordinates, type LinkType } from "@sonder/shared";
import { prisma } from "@/lib/prisma";

export const noteRepository = {
  create(input: {
    authorUserId: string;
    text?: string;
    linkUrl?: string;
    linkType?: LinkType;
    isAnonymous: boolean;
    latitudeRounded: number;
    longitudeRounded: number;
    expiresAt: Date;
  }) {
    return prisma.note.create({
      data: input,
      include: {
        author: {
          include: {
            presence: true
          }
        }
      }
    });
  },

  findById(noteId: string) {
    return prisma.note.findUnique({
      where: { id: noteId }
    });
  },

  findNearbyCandidates(input: {
    viewerUserId: string;
    center: Coordinates;
    radiusMeters: number;
    now: Date;
  }) {
    const box = boundingBox(input.center, input.radiusMeters);

    return prisma.note.findMany({
      where: {
        expiresAt: {
          gt: input.now
        },
        hiddenAt: null,
        deletedAt: null,
        latitudeRounded: {
          gte: box.minLatitude,
          lte: box.maxLatitude
        },
        longitudeRounded: {
          gte: box.minLongitude,
          lte: box.maxLongitude
        },
        author: {
          isBanned: false
        },
        reports: {
          none: {
            reporterUserId: input.viewerUserId
          }
        }
      },
      include: {
        author: {
          include: {
            presence: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 100
    });
  },

  incrementReportCount(noteId: string) {
    return prisma.note.update({
      where: { id: noteId },
      data: {
        reportCount: {
          increment: 1
        }
      }
    });
  },

  hideNote(noteId: string, hiddenAt = new Date()) {
    return prisma.note.update({
      where: { id: noteId },
      data: { hiddenAt }
    });
  },

  deleteNote(noteId: string, deletedAt = new Date()) {
    return prisma.note.update({
      where: { id: noteId },
      data: { deletedAt }
    });
  },

  listRecent(input: { filter?: "reported" | "hidden" | "deleted" | "active"; limit?: number }) {
    const filter = input.filter;

    return prisma.note.findMany({
      where: {
        ...(filter === "reported" ? { reportCount: { gt: 0 } } : {}),
        ...(filter === "hidden" ? { hiddenAt: { not: null } } : {}),
        ...(filter === "deleted" ? { deletedAt: { not: null } } : {}),
        ...(filter === "active"
          ? { expiresAt: { gt: new Date() }, hiddenAt: null, deletedAt: null }
          : {})
      },
      include: {
        author: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: input.limit ?? 100
    });
  }
};

