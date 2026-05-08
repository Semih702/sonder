import type { AnonymousAuthInput, AnonymousAuthResponseDto } from "@sonder/shared";
import { signAccessToken } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { getFeatureFlags } from "@/lib/featureFlags";
import { inviteService } from "@/services/inviteService";
import { userRepository } from "@/repositories/userRepository";

export const authService = {
  async createAnonymousSession(input: AnonymousAuthInput): Promise<AnonymousAuthResponseDto> {
    if (!input.acceptedTerms || !input.acceptedPrivacy || !input.ageConfirmed) {
      throw new ApiError(400, "validation_error", "Age, Terms, and Privacy acceptance are required.");
    }

    if (getFeatureFlags().inviteOnlyMode) {
      if (!input.inviteCode) {
        throw new ApiError(403, "forbidden", "Invite code is required for the beta.");
      }

      await inviteService.consumeInviteCode(input.inviteCode);
    }

    const user = await userRepository.createAnonymousUser();
    const accessToken = await signAccessToken(user.id);

    return {
      accessToken,
      userId: user.id,
      displayName: user.displayName
    };
  }
};

