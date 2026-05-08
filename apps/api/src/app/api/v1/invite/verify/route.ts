import { inviteVerifySchema } from "@sonder/shared";
import { handleRoute, jsonOk, readJson } from "@/lib/errors";
import { inviteService } from "@/services/inviteService";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleRoute(async () => {
    const body = inviteVerifySchema.parse(await readJson(request));
    return jsonOk(await inviteService.verifyInviteCode(body.inviteCode));
  });
}

