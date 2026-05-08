import { z } from "zod";

export const inviteVerifySchema = z.object({
  inviteCode: z.string().trim().min(1).max(64)
});

export type InviteVerifyInput = z.infer<typeof inviteVerifySchema>;

