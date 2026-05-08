import type { DeviceRegistrationDto, RegisterDeviceInput } from "@sonder/shared";
import { deviceRepository } from "@/repositories/deviceRepository";

export const devicesService = {
  async registerDevice(userId: string, input: RegisterDeviceInput): Promise<DeviceRegistrationDto> {
    const device = await deviceRepository.registerForUser(userId, input);

    return {
      id: device.id,
      platform: device.platform as DeviceRegistrationDto["platform"],
      provider: device.provider as DeviceRegistrationDto["provider"],
      isActive: device.isActive
    };
  }
};

