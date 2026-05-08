import { z } from "zod";

export const registerDeviceSchema = z.object({
  platform: z.enum(["ios", "android"]),
  pushToken: z.string().trim().min(12).max(4096),
  provider: z.enum(["apns", "fcm"])
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;

