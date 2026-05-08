import {
  APP_CONFIG,
  createNoteSchema,
  distanceMeters,
  type Coordinates,
  type CreateNoteInput,
  type CreateNoteResponseDto,
  type LinkType,
  type NearbyNoteDto,
  type NearbyNotesQuery
} from "@sonder/shared";
import { ApiError } from "@/lib/errors";
import { getFeatureFlags } from "@/lib/featureFlags";
import { detectAndValidateLink } from "@/lib/links";
import { roundedCoordinates } from "@/lib/location";
import { logger } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rateLimit";
import { noteRepository } from "@/repositories/noteRepository";
import { presenceRepository } from "@/repositories/presenceRepository";
import { userRepository } from "@/repositories/userRepository";
import { notificationService } from "@/services/notificationService";
import { presenceService } from "@/services/presenceService";

const BANNED_PHRASE_PLACEHOLDERS = ["kill yourself", "doxx", "home address"];

type NoteCandidate = Awaited<ReturnType<typeof noteRepository.findNearbyCandidates>>[number];

function containsBannedPhrase(input?: string): boolean {
  const lowered = input?.toLowerCase() ?? "";
  return BANNED_PHRASE_PLACEHOLDERS.some((phrase) => lowered.includes(phrase));
}

export function calculateExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + APP_CONFIG.NOTE_TTL_HOURS * 60 * 60 * 1000);
}

export function isExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}

function assertServiceOpenForPosting() {
  const flags = getFeatureFlags();

  if (flags.maintenanceMode) {
    throw new ApiError(503, "maintenance", "Sonder is temporarily unavailable.");
  }

  if (!flags.postingEnabled) {
    throw new ApiError(403, "posting_disabled", "Posting is temporarily paused.");
  }
}

function assertServiceOpenForReading() {
  if (getFeatureFlags().maintenanceMode) {
    throw new ApiError(503, "maintenance", "Sonder is temporarily unavailable.");
  }
}

function toNearbyNoteDto(note: NoteCandidate, viewerLocation: Coordinates, now = new Date()): NearbyNoteDto {
  const noteLocation = {
    latitude: note.latitudeRounded,
    longitude: note.longitudeRounded
  };

  return {
    id: note.id,
    text: note.text ?? undefined,
    linkUrl: note.linkUrl ?? undefined,
    linkType: (note.linkType ?? undefined) as LinkType | undefined,
    authorLabel: note.isAnonymous ? "Anonymous" : note.author.displayName,
    isAnonymous: note.isAnonymous,
    createdAt: note.createdAt.toISOString(),
    expiresAt: note.expiresAt.toISOString(),
    distanceMeters: Math.round(distanceMeters(viewerLocation, noteLocation)),
    isOwnerNearby: presenceService.isOwnerNearby(note.author.presence, noteLocation, now)
  };
}

export const notesService = {
  async getNearbyNotes(userId: string, query: NearbyNotesQuery): Promise<{ notes: NearbyNoteDto[] }> {
    assertServiceOpenForReading();

    const now = new Date();
    const candidates = await noteRepository.findNearbyCandidates({
      viewerUserId: userId,
      center: query,
      radiusMeters: APP_CONFIG.VISIBILITY_RADIUS_METERS,
      now
    });

    const notes = candidates
      .filter(
        (note) =>
          distanceMeters(query, {
            latitude: note.latitudeRounded,
            longitude: note.longitudeRounded
          }) <= APP_CONFIG.VISIBILITY_RADIUS_METERS,
      )
      .map((note) => toNearbyNoteDto(note, query, now));

    return { notes };
  },

  async createNote(userId: string, input: CreateNoteInput): Promise<CreateNoteResponseDto> {
    assertServiceOpenForPosting();
    const parsed = createNoteSchema.parse(input);

    const user = await userRepository.findById(userId);
    if (!user || user.isBanned) {
      throw new ApiError(403, "forbidden", "This account cannot post notes.");
    }

    if (containsBannedPhrase(parsed.text)) {
      throw new ApiError(400, "validation_error", "This note cannot be posted.");
    }

    await enforceRateLimit({
      userId,
      action: "create_note",
      maxEvents: APP_CONFIG.MAX_NOTES_PER_USER_PER_HOUR
    });

    const link = detectAndValidateLink(parsed.linkUrl);
    const rounded = roundedCoordinates(parsed);
    const expiresAt = calculateExpiresAt();
    const presence = await presenceRepository.upsert(userId, parsed);

    const note = await noteRepository.create({
      authorUserId: userId,
      text: parsed.text,
      linkUrl: link.linkUrl,
      linkType: link.linkType,
      isAnonymous: parsed.isAnonymous,
      latitudeRounded: rounded.latitude,
      longitudeRounded: rounded.longitude,
      expiresAt
    });

    const noteWithPresence = {
      ...note,
      author: {
        ...note.author,
        presence
      }
    };

    try {
      await notificationService.notifyNearbyUsers(note);
    } catch (error) {
      logger.warn("Nearby notification job failed", {
        noteId: note.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    return {
      note: toNearbyNoteDto(noteWithPresence, parsed)
    };
  }
};

