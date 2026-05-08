import type { RegisterDeviceInput, DeviceRegistrationDto } from "@sonder/shared";
import { apiRequest } from "./client";

export function registerDevice(token: string, input: RegisterDeviceInput) {
  return apiRequest<DeviceRegistrationDto>("/api/v1/devices/register", {
    method: "POST",
    token,
    body: input
  });
}

