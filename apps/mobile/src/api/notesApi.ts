import type { CreateNoteInput, CreateNoteResponseDto, NearbyNoteDto } from "@sonder/shared";
import { apiRequest } from "./client";

export function fetchNearbyNotes(
  token: string,
  coordinates: { latitude: number; longitude: number },
) {
  const params = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude)
  });

  return apiRequest<{ notes: NearbyNoteDto[] }>(`/api/v1/notes/nearby?${params.toString()}`, {
    token
  });
}

export function createNote(token: string, input: CreateNoteInput) {
  return apiRequest<CreateNoteResponseDto>("/api/v1/notes", {
    method: "POST",
    token,
    body: input
  });
}

export function reportNote(token: string, noteId: string, reason?: string) {
  return apiRequest<{ success: boolean; hiddenForUser: boolean; autoHidden: boolean }>(
    `/api/v1/notes/${noteId}/report`,
    {
      method: "POST",
      token,
      body: { reason }
    },
  );
}

