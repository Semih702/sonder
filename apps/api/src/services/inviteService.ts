import type { InviteVerificationDto } from "@sonder/shared";
import { ApiError } from "@/lib/errors";
import { inviteRepository } from "@/repositories/inviteRepository";

export type InviteLike = {
  id: string;
  isActive: boolean;
  expiresAt: Date | null;
  maxUses: number;
  usedCount: number;
};

export function getInviteUsability(
  invite: InviteLike | null,
  now = new Date(),
): InviteVerificationDto {
  if (!invite) {
    return { usable: false, reason: "missing" };
  }

  if (!invite.isActive) {
    return { usable: false, reason: "inactive" };
  }

  if (invite.expiresAt && invite.expiresAt.getTime() <= now.getTime()) {
    return { usable: false, reason: "expired" };
  }

  if (invite.usedCount >= invite.maxUses) {
    return { usable: false, reason: "exhausted" };
  }

  return { usable: true };
}

export const inviteService = {
  async verifyInviteCode(inviteCode: string, now = new Date()): Promise<InviteVerificationDto> {
    const invite = await inviteRepository.findByCode(inviteCode.trim());
    return getInviteUsability(invite, now);
  },

  async consumeInviteCode(inviteCode: string, now = new Date()) {
    const invite = await inviteRepository.findByCode(inviteCode.trim());
    const usability = getInviteUsability(invite, now);

    if (!invite || !usability.usable) {
      throw new ApiError(403, "forbidden", "Invite code is not usable.", usability);
    }

    return inviteRepository.consume(invite.id);
  }
};

