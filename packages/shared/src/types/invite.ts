export type InviteVerificationDto = {
  usable: boolean;
  reason?: "missing" | "inactive" | "expired" | "exhausted";
};

