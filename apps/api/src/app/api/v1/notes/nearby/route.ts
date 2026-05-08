import { nearbyNotesQuerySchema } from "@sonder/shared";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { ApiError, handleRoute, jsonOk } from "@/lib/errors";
import { notesService } from "@/services/notesService";

export const dynamic = "force-dynamic";

function parseNumberParam(value: string | null, name: string): number {
  if (!value) {
    throw new ApiError(400, "bad_request", `Missing ${name}.`);
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new ApiError(400, "bad_request", `${name} must be a number.`);
  }

  return number;
}

export function GET(request: NextRequest) {
  return handleRoute(async () => {
    const auth = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const query = nearbyNotesQuerySchema.parse({
      latitude: parseNumberParam(searchParams.get("latitude"), "latitude"),
      longitude: parseNumberParam(searchParams.get("longitude"), "longitude")
    });

    return jsonOk(await notesService.getNearbyNotes(auth.userId, query));
  });
}

