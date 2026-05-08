import { describe, expect, it } from "vitest";
import { APP_CONFIG } from "@sonder/shared";
import { isWithinRateLimit } from "@/lib/rateLimit";
import { isOwnerPresenceNearby } from "@/services/presenceService";
import { calculateExpiresAt, isExpired } from "@/services/notesService";
import { getInviteUsability } from "@/services/inviteService";
import { shouldAutoHideReportCount } from "@/services/moderationService";
import { selectNotificationRecipients } from "@/services/notificationService";

describe("note TTL logic", () => {
  it("expires notes using the server-side app config", () => {
    const now = new Date("2026-05-08T12:00:00.000Z");
    const expiresAt = calculateExpiresAt(now);

    expect(expiresAt.toISOString()).toBe("2026-05-09T12:00:00.000Z");
    expect(isExpired(expiresAt, now)).toBe(false);
    expect(isExpired(expiresAt, new Date("2026-05-09T12:00:00.000Z"))).toBe(true);
  });
});

describe("presence logic", () => {
  it("returns true only for active nearby presence", () => {
    const noteLocation = { latitude: 40.7419, longitude: -73.9893 };

    expect(
      isOwnerPresenceNearby(
        {
          lastLatitudeRounded: 40.742,
          lastLongitudeRounded: -73.9893,
          lastSeenAt: new Date("2026-05-08T12:00:00.000Z")
        },
        noteLocation,
        new Date("2026-05-08T12:04:00.000Z"),
      ),
    ).toBe(true);

    expect(
      isOwnerPresenceNearby(
        {
          lastLatitudeRounded: 40.742,
          lastLongitudeRounded: -73.9893,
          lastSeenAt: new Date("2026-05-08T11:50:00.000Z")
        },
        noteLocation,
        new Date("2026-05-08T12:00:00.000Z"),
      ),
    ).toBe(false);
  });
});

describe("invite validation", () => {
  it("rejects missing, inactive, expired, and exhausted codes", () => {
    const now = new Date("2026-05-08T12:00:00.000Z");

    expect(getInviteUsability(null, now)).toEqual({ usable: false, reason: "missing" });
    expect(
      getInviteUsability(
        { id: "1", isActive: false, expiresAt: null, usedCount: 0, maxUses: 1 },
        now,
      ),
    ).toEqual({ usable: false, reason: "inactive" });
    expect(
      getInviteUsability(
        { id: "1", isActive: true, expiresAt: new Date("2026-05-08T11:59:00.000Z"), usedCount: 0, maxUses: 1 },
        now,
      ),
    ).toEqual({ usable: false, reason: "expired" });
    expect(
      getInviteUsability(
        { id: "1", isActive: true, expiresAt: null, usedCount: 1, maxUses: 1 },
        now,
      ),
    ).toEqual({ usable: false, reason: "exhausted" });
  });
});

describe("rate limit and moderation helpers", () => {
  it("checks rate limit counts and report thresholds", () => {
    expect(isWithinRateLimit(4, 5)).toBe(true);
    expect(isWithinRateLimit(5, 5)).toBe(false);
    expect(shouldAutoHideReportCount(APP_CONFIG.REPORT_AUTO_HIDE_THRESHOLD - 1)).toBe(false);
    expect(shouldAutoHideReportCount(APP_CONFIG.REPORT_AUTO_HIDE_THRESHOLD)).toBe(true);
  });
});

describe("notification recipient selection", () => {
  it("excludes the author and users outside the visibility radius", () => {
    const recipients = selectNotificationRecipients({
      authorUserId: "author",
      noteLocation: { latitude: 40.7419, longitude: -73.9893 },
      candidates: [
        { userId: "author", lastLatitudeRounded: 40.7419, lastLongitudeRounded: -73.9893 },
        { userId: "near", lastLatitudeRounded: 40.742, lastLongitudeRounded: -73.9893 },
        { userId: "far", lastLatitudeRounded: 40.75, lastLongitudeRounded: -73.9893 }
      ]
    });

    expect(recipients.map((recipient) => recipient.userId)).toEqual(["near"]);
  });
});

