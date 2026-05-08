import type { PresenceHeartbeatInput } from "@sonder/shared";
import { apiRequest } from "./client";

export function sendPresenceHeartbeat(token: string, input: PresenceHeartbeatInput) {
  return apiRequest<{ success: boolean }>("/api/v1/presence/heartbeat", {
    method: "POST",
    token,
    body: input
  });
}

