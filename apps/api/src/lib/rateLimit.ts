import { prisma } from "./prisma";
import { ApiError } from "./errors";

export function isWithinRateLimit(currentCount: number, maxEvents: number): boolean {
  return currentCount < maxEvents;
}

export async function enforceRateLimit(input: {
  userId: string;
  action: string;
  maxEvents: number;
  windowMinutes?: number;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const windowMinutes = input.windowMinutes ?? 60;
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

  const count = await prisma.rateLimitEvent.count({
    where: {
      userId: input.userId,
      action: input.action,
      createdAt: {
        gte: windowStart
      }
    }
  });

  if (!isWithinRateLimit(count, input.maxEvents)) {
    throw new ApiError(429, "rate_limited", "Please slow down and try again later.");
  }

  await prisma.rateLimitEvent.create({
    data: {
      userId: input.userId,
      action: input.action,
      createdAt: now
    }
  });
}

export async function tryConsumeRateLimit(input: {
  userId: string;
  action: string;
  maxEvents: number;
  windowMinutes?: number;
  now?: Date;
}): Promise<boolean> {
  try {
    await enforceRateLimit(input);
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.code === "rate_limited") {
      return false;
    }
    throw error;
  }
}

