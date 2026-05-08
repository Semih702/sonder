import { useCallback, useState } from "react";
import * as Location from "expo-location";
import type { Coordinates } from "@sonder/shared";

export function useCurrentLocation() {
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocation = useCallback(async (): Promise<Coordinates | null> => {
    setLoading(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setPermissionDenied(true);
        return null;
      }

      setPermissionDenied(false);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    permissionDenied,
    requestLocation
  };
}

