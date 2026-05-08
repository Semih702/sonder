import type { RegisterDeviceInput } from "@sonder/shared";
import { prisma } from "@/lib/prisma";

export const deviceRepository = {
  async registerForUser(userId: string, input: RegisterDeviceInput) {
    await prisma.device.updateMany({
      where: {
        provider: input.provider,
        pushToken: input.pushToken,
        NOT: {
          userId
        }
      },
      data: {
        isActive: false
      }
    });

    return prisma.device.upsert({
      where: {
        provider_pushToken: {
          provider: input.provider,
          pushToken: input.pushToken
        }
      },
      create: {
        userId,
        platform: input.platform,
        provider: input.provider,
        pushToken: input.pushToken,
        isActive: true
      },
      update: {
        userId,
        platform: input.platform,
        isActive: true
      }
    });
  },

  findActiveByUserId(userId: string) {
    return prisma.device.findMany({
      where: {
        userId,
        isActive: true
      }
    });
  }
};

