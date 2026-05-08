import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { registerDevice } from "@/api/devicesApi";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowAlert: true
  })
});

export function usePushRegistration(accessToken?: string) {
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!accessToken || Platform.OS === "web") {
        return;
      }

      const current = await Notifications.getPermissionsAsync();
      const permission =
        current.status === "granted" ? current : await Notifications.requestPermissionsAsync();

      if (permission.status !== "granted" || cancelled) {
        return;
      }

      const token = await Notifications.getDevicePushTokenAsync();
      const platform = Platform.OS === "ios" ? "ios" : "android";
      const provider = Platform.OS === "ios" ? "apns" : "fcm";

      await registerDevice(accessToken, {
        platform,
        provider,
        pushToken: token.data
      });
    }

    run().catch(() => {
      // Push registration must never block reading or posting notes.
    });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);
}

