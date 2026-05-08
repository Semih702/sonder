import type { AnonymousAuthInput, AnonymousAuthResponseDto } from "@sonder/shared";
import { apiRequest } from "./client";

export function createAnonymousSession(input: AnonymousAuthInput) {
  return apiRequest<AnonymousAuthResponseDto>("/api/v1/auth/anonymous", {
    method: "POST",
    body: input
  });
}

