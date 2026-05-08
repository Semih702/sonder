import type { LinkType } from "../types/note";

export function normalizeOptionalLink(input?: string | null): string | undefined {
  const trimmed = input?.trim();
  return trimmed ? trimmed : undefined;
}

export function detectLinkType(input: string): LinkType {
  const url = new URL(input);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  if (host === "youtu.be" || host === "youtube.com" || host.endsWith(".youtube.com")) {
    return "youtube";
  }

  if (host === "open.spotify.com") {
    return "spotify";
  }

  return "generic";
}

export function isAllowedHttpUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

