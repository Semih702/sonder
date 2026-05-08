import { boundingBox, type Coordinates } from "@sonder/shared";
import { roundedCoordinates } from "@/lib/location";
import { prisma } from "@/lib/prisma";

export const presenceRepository = {
  upsert(userId: string, coordinates: Coordinates, now = new Date()) {
    const rounded = roundedCoordinates(coordinates);

    return prisma.presence.upsert({
      where: { userId },
      create: {
        userId,
        lastLatitudeRounded: rounded.latitude,
        lastLongitudeRounded: rounded.longitude,
        lastSeenAt: now
      },
      update: {
        lastLatitudeRounded: rounded.latitude,
        lastLongitudeRounded: rounded.longitude,
        lastSeenAt: now
      }
    });
  },

  findByUserId(userId: string) {
    return prisma.presence.findUnique({
      where: { userId }
    });
  },

  findActiveCandidatesWithinBox(input: {
    center: Coordinates;
    radiusMeters: number;
    since: Date;
  }) {
    const box = boundingBox(input.center, input.radiusMeters);

    return prisma.presence.findMany({
      where: {
        lastSeenAt: {
          gte: input.since
        },
        lastLatitudeRounded: {
          gte: box.minLatitude,
          lte: box.maxLatitude
        },
        lastLongitudeRounded: {
          gte: box.minLongitude,
          lte: box.maxLongitude
        },
        user: {
          isBanned: false
        }
      },
      include: {
        user: true
      }
    });
  }
};

