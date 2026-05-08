import type { Coordinates, PresenceHeartbeatInput } from "@sonder/shared";
import { isPresenceActiveAndNearby, type PresenceSnapshot } from "@/lib/location";
import { presenceRepository } from "@/repositories/presenceRepository";

export function isOwnerPresenceNearby(
  presence: PresenceSnapshot | null | undefined,
  noteLocation: Coordinates,
  now = new Date(),
): boolean {
  return isPresenceActiveAndNearby(presence, noteLocation, now);
}

export const presenceService = {
  heartbeat(userId: string, input: PresenceHeartbeatInput) {
    return presenceRepository.upsert(userId, input);
  },

  isOwnerNearby(
    presence: PresenceSnapshot | null | undefined,
    noteLocation: Coordinates,
    now = new Date(),
  ) {
    return isOwnerPresenceNearby(presence, noteLocation, now);
  }
};

