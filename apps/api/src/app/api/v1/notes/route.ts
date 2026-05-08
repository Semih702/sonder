import { createNoteSchema } from "@sonder/shared";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleRoute, jsonCreated, readJson } from "@/lib/errors";
import { notesService } from "@/services/notesService";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return handleRoute(async () => {
    const auth = await requireAuth(request);
    const body = createNoteSchema.parse(await readJson(request));
    return jsonCreated(await notesService.createNote(auth.userId, body));
  });
}

