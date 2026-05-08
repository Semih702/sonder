import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { getEnv } from "./env";
import { ApiError } from "./errors";

export type AuthContext = {
  userId: string;
};

function jwtSecret(): Uint8Array {
  return new TextEncoder().encode(getEnv().JWT_SECRET);
}

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(jwtSecret());
}

export async function verifyAccessToken(token: string): Promise<AuthContext> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    if (!payload.sub) {
      throw new ApiError(401, "unauthorized", "Invalid session.");
    }

    return { userId: payload.sub };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "unauthorized", "Invalid or expired session.");
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthContext> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    throw new ApiError(401, "unauthorized", "Missing access token.");
  }

  return verifyAccessToken(token);
}

export function requireAdmin(request: NextRequest) {
  const env = getEnv();
  if (!env.ADMIN_DASHBOARD_ENABLED) {
    throw new ApiError(403, "forbidden", "Admin dashboard is disabled.");
  }

  const adminSecret = request.headers.get("x-admin-secret");
  if (!env.ADMIN_SECRET || adminSecret !== env.ADMIN_SECRET) {
    throw new ApiError(401, "unauthorized", "Invalid admin credentials.");
  }
}

