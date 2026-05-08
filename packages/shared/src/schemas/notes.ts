import { z } from "zod";
import { APP_CONFIG } from "../config/appConfig";
import { isAllowedHttpUrl } from "../utils/links";
import { coordinatesSchema } from "./common";

const optionalTrimmedText = z
  .string()
  .trim()
  .max(APP_CONFIG.MAX_NOTE_LENGTH)
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const optionalLink = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))
  .refine((value) => value === undefined || isAllowedHttpUrl(value), {
    message: "Only http and https links are allowed"
  });

export const createNoteSchema = coordinatesSchema
  .extend({
    text: optionalTrimmedText,
    linkUrl: optionalLink,
    isAnonymous: z.boolean()
  })
  .refine((value) => Boolean(value.text || value.linkUrl), {
    message: "Add note text, a link, or both",
    path: ["text"]
  });

export const nearbyNotesQuerySchema = coordinatesSchema;

export const reportNoteSchema = z.object({
  reason: z.string().trim().max(280).optional()
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type NearbyNotesQuery = z.infer<typeof nearbyNotesQuerySchema>;
export type ReportNoteInput = z.infer<typeof reportNoteSchema>;

