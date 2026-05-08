import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRoute, jsonOk } from "@/lib/errors";
import { adminService } from "@/services/adminService";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return handleRoute(async () => {
    requireAdmin(request);
    return jsonOk({ notes: await adminService.listNotes(request.nextUrl.searchParams.get("filter") ?? undefined) });
  });
}

