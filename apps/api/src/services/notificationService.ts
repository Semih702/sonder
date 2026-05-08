import { APP_CONFIG, distanceMeters, type Coordinates } from "@sonder/shared";
import { logger } from "@/lib/logger";
import { sendPushNotification } from "@/lib/notifications";
import { tryConsumeRateLimit } from "@/lib/rateLimit";
import { deviceRepository } from "@/repositories/deviceRepository";
import { notificationRepository } from "@/repositories/notificationRepository";
import { presenceRepository } from "@/repositories/presenceRepository";

export type NotificationRecipientCandidate = {
  userId: string;
  lastLatitudeRounded: number;
  lastLongitudeRounded: number;
};

export function selectNotificationRecipients(input: {
  authorUserId: string;
  noteLocation: Coordinates;
  candidates: NotificationRecipientCandidate[];
}) {
  return input.candidates.filter((candidate) => {
    if (candidate.userId === input.authorUserId) {
      return false;
    }

    return (
      distanceMeters(
        {
          latitude: candidate.lastLatitudeRounded,
          longitude: candidate.lastLongitudeRounded
        },
        input.noteLocation,
      ) <= APP_CONFIG.VISIBILITY_RADIUS_METERS
    );
  });
}

export const notificationService = {
  async notifyNearbyUsers(note: {
    id: string;
    authorUserId: string;
    latitudeRounded: number;
    longitudeRounded: number;
  }) {
    const now = new Date();
    const since = new Date(
      now.getTime() - APP_CONFIG.PRESENCE_ACTIVE_WINDOW_MINUTES * 60 * 1000,
    );
    const noteLocation = {
      latitude: note.latitudeRounded,
      longitude: note.longitudeRounded
    };

    const candidates = await presenceRepository.findActiveCandidatesWithinBox({
      center: noteLocation,
      radiusMeters: APP_CONFIG.VISIBILITY_RADIUS_METERS,
      since
    });

    const recipients = selectNotificationRecipients({
      authorUserId: note.authorUserId,
      noteLocation,
      candidates
    });

    for (const recipient of recipients) {
      const existing = await notificationRepository.findExisting({
        recipientUserId: recipient.userId,
        noteId: note.id,
        type: "new_note_nearby"
      });

      if (existing) {
        continue;
      }

      const allowed = await tryConsumeRateLimit({
        userId: recipient.userId,
        action: "push_notification",
        maxEvents: APP_CONFIG.MAX_PUSH_NOTIFICATIONS_PER_USER_PER_HOUR
      });

      if (!allowed) {
        continue;
      }

      const devices = await deviceRepository.findActiveByUserId(recipient.userId);
      if (devices.length === 0) {
        continue;
      }

      for (const device of devices) {
        if (device.provider !== "apns" && device.provider !== "fcm") {
          continue;
        }

        try {
          await sendPushNotification(
            {
              provider: device.provider,
              pushToken: device.pushToken
            },
            {
              title: "New note nearby",
              body: "Someone left a note around you."
            },
          );
        } catch (error) {
          logger.warn("Push notification send failed", {
            recipientUserId: recipient.userId,
            noteId: note.id,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      await notificationRepository.create({
        recipientUserId: recipient.userId,
        noteId: note.id,
        type: "new_note_nearby"
      });
    }
  }
};

