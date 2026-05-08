export type LinkType = "youtube" | "spotify" | "generic";

export type NearbyNoteDto = {
  id: string;
  text?: string;
  linkUrl?: string;
  linkType?: LinkType;
  authorLabel: "Anonymous" | string;
  isAnonymous: boolean;
  createdAt: string;
  expiresAt: string;
  distanceMeters: number;
  isOwnerNearby: boolean;
};

export type CreateNoteResponseDto = {
  note: NearbyNoteDto;
};

