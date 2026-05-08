export type DevicePlatform = "ios" | "android";
export type PushProvider = "apns" | "fcm";

export type DeviceRegistrationDto = {
  id: string;
  platform: DevicePlatform;
  provider: PushProvider;
  isActive: boolean;
};

