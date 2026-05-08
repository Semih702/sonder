import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRoute, jsonOk } from "@/lib/errors";
import { adminService } from "@/services/adminService";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export function POST(request: NextRequest, context: RouteContext) {
  return handleRoute(async () => {
    requireAdmin(request);
    return jsonOk({ note: await adminService.hideNote(context.params.id) });
  });
}

