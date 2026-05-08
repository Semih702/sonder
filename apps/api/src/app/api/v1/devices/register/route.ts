import { registerDeviceSchema } from "@sonder/shared";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleRoute, jsonOk, readJson } from "@/lib/errors";
import { devicesService } from "@/services/devicesService";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return handleRoute(async () => {
    const auth = await requireAuth(request);
    const body = registerDeviceSchema.parse(await readJson(request));
    return jsonOk(await devicesService.registerDevice(auth.userId, body));
  });
}

