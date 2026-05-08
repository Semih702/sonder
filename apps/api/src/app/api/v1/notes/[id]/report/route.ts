import { reportNoteSchema } from "@sonder/shared";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleRoute, jsonOk, readJson } from "@/lib/errors";
import { moderationService } from "@/services/moderationService";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export function POST(request: NextRequest, context: RouteContext) {
  return handleRoute(async () => {
    const auth = await requireAuth(request);
    const body = reportNoteSchema.parse(await readJson(request));
    return jsonOk(await moderationService.reportNote(auth.userId, context.params.id, body));
  });
}

