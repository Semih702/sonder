import type { InviteVerificationDto } from "@sonder/shared";
import { apiRequest } from "./client";

export function verifyInviteCode(inviteCode: string) {
  return apiRequest<InviteVerificationDto>("/api/v1/invite/verify", {
    method: "POST",
    body: { inviteCode }
  });
}

