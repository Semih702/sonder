import { anonymousAuthSchema } from "@sonder/shared";
import { handleRoute, jsonOk, readJson } from "@/lib/errors";
import { authService } from "@/services/authService";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleRoute(async () => {
    const body = anonymousAuthSchema.parse(await readJson(request));
    return jsonOk(await authService.createAnonymousSession(body));
  });
}

