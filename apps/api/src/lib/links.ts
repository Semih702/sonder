import { detectLinkType, isAllowedHttpUrl, normalizeOptionalLink, type LinkType } from "@sonder/shared";
import { ApiError } from "./errors";

export function detectAndValidateLink(input?: string): { linkUrl?: string; linkType?: LinkType } {
  const linkUrl = normalizeOptionalLink(input);
  if (!linkUrl) {
    return {};
  }

  if (!isAllowedHttpUrl(linkUrl)) {
    throw new ApiError(400, "validation_error", "Only http and https links are allowed.");
  }

  return {
    linkUrl,
    linkType: detectLinkType(linkUrl)
  };
}

