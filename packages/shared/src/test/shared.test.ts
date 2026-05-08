import { describe, expect, it } from "vitest";
import { APP_CONFIG } from "../config/appConfig";
import { createNoteSchema } from "../schemas/notes";
import { detectLinkType, isAllowedHttpUrl } from "../utils/links";
import { distanceMeters, roundCoordinate } from "../utils/distance";

describe("shared distance utilities", () => {
  it("calculates short distances in meters", () => {
    const distance = distanceMeters(
      { latitude: 40.741895, longitude: -73.989308 },
      { latitude: 40.742295, longitude: -73.989308 },
    );

    expect(distance).toBeGreaterThan(40);
    expect(distance).toBeLessThan(50);
  });

  it("rounds coordinates using app config precision", () => {
    expect(roundCoordinate(40.741895, APP_CONFIG.LOCATION_DECIMAL_PRECISION)).toBe(40.7419);
  });
});

describe("shared link utilities", () => {
  it("detects supported link types", () => {
    expect(detectLinkType("https://youtu.be/example")).toBe("youtube");
    expect(detectLinkType("https://www.youtube.com/watch?v=example")).toBe("youtube");
    expect(detectLinkType("https://open.spotify.com/track/example")).toBe("spotify");
    expect(detectLinkType("https://example.com/article")).toBe("generic");
  });

  it("only allows http and https URLs", () => {
    expect(isAllowedHttpUrl("https://example.com")).toBe(true);
    expect(isAllowedHttpUrl("http://example.com")).toBe(true);
    expect(isAllowedHttpUrl("javascript:alert(1)")).toBe(false);
  });
});

describe("shared validation schemas", () => {
  it("rejects empty note submissions", () => {
    expect(() =>
      createNoteSchema.parse({
        text: "",
        linkUrl: "",
        isAnonymous: true,
        latitude: 40,
        longitude: 29
      }),
    ).toThrow();
  });

  it("enforces max note length", () => {
    expect(() =>
      createNoteSchema.parse({
        text: "x".repeat(APP_CONFIG.MAX_NOTE_LENGTH + 1),
        isAnonymous: true,
        latitude: 40,
        longitude: 29
      }),
    ).toThrow();
  });
});

