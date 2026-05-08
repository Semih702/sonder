import * as Location from "expo-location";

export async function hasForegroundLocationPermission(): Promise<boolean> {
  const permission = await Location.getForegroundPermissionsAsync();
  return permission.status === Location.PermissionStatus.GRANTED;
}

