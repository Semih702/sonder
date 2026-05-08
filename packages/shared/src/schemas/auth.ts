import { z } from "zod";

export const anonymousAuthSchema = z.object({
  acceptedTerms: z.literal(true),
  acceptedPrivacy: z.literal(true),
  ageConfirmed: z.literal(true),
  inviteCode: z.string().trim().min(1).max(64).optional()
});

export type AnonymousAuthInput = z.infer<typeof anonymousAuthSchema>;

