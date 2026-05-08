export { APP_CONFIG } from "./config/appConfig";

export type { CreateNoteResponseDto, LinkType, NearbyNoteDto } from "./types/note";
export type { AnonymousAuthResponseDto, UserDto } from "./types/user";
export type { DevicePlatform, DeviceRegistrationDto, PushProvider } from "./types/device";
export type { InviteVerificationDto } from "./types/invite";

export {
  anonymousAuthSchema,
  type AnonymousAuthInput
} from "./schemas/auth";
export {
  registerDeviceSchema,
  type RegisterDeviceInput
} from "./schemas/devices";
export {
  inviteVerifySchema,
  type InviteVerifyInput
} from "./schemas/invite";
export {
  createNoteSchema,
  nearbyNotesQuerySchema,
  reportNoteSchema,
  type CreateNoteInput,
  type NearbyNotesQuery,
  type ReportNoteInput
} from "./schemas/notes";
export {
  presenceHeartbeatSchema,
  type PresenceHeartbeatInput
} from "./schemas/presence";

export {
  boundingBox,
  distanceMeters,
  roundCoordinate,
  type Coordinates
} from "./utils/distance";
export { detectLinkType, isAllowedHttpUrl, normalizeOptionalLink } from "./utils/links";

