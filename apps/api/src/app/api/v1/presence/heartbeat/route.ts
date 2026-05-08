import { presenceHeartbeatSchema } from "@sonder/shared";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleRoute, jsonOk, readJson } from "@/lib/errors";
import { presenceService } from "@/services/presenceService";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return handleRoute(async () => {
    const auth = await requireAuth(request);
    const body = presenceHeartbeatSchema.parse(await readJson(request));
    await presenceService.heartbeat(auth.userId, body);
    return jsonOk({ success: true });
  });
}

