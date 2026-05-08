import { APP_CONFIG, distanceMeters, roundCoordinate, type Coordinates } from "@sonder/shared";

export function roundedCoordinates(input: Coordinates): Coordinates {
  return {
    latitude: roundCoordinate(input.latitude, APP_CONFIG.LOCATION_DECIMAL_PRECISION),
    longitude: roundCoordinate(input.longitude, APP_CONFIG.LOCATION_DECIMAL_PRECISION)
  };
}

export function isWithinMeters(a: Coordinates, b: Coordinates, radiusMeters: number): boolean {
  return distanceMeters(a, b) <= radiusMeters;
}

export type PresenceSnapshot = {
  lastLatitudeRounded: number;
  lastLongitudeRounded: number;
  lastSeenAt: Date;
};

export function isPresenceActiveAndNearby(
  presence: PresenceSnapshot | null | undefined,
  noteLocation: Coordinates,
  now = new Date(),
): boolean {
  if (!presence) {
    return false;
  }

  const activeWindowMs = APP_CONFIG.PRESENCE_ACTIVE_WINDOW_MINUTES * 60 * 1000;
  if (now.getTime() - presence.lastSeenAt.getTime() > activeWindowMs) {
    return false;
  }

  return isWithinMeters(
    {
      latitude: presence.lastLatitudeRounded,
      longitude: presence.lastLongitudeRounded
    },
    noteLocation,
    APP_CONFIG.PRESENCE_RADIUS_METERS,
  );
}

