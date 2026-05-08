import { StyleSheet, Text, View } from "react-native";
import { PermissionCard } from "@/components/PermissionCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";

export function LocationPermissionScreen({ onGranted }: { onGranted: () => void }) {
  const { loading, permissionDenied, requestLocation } = useCurrentLocation();

  async function request() {
    const location = await requestLocation();
    if (location) {
      onGranted();
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <PermissionCard
          title="Location permission"
          body="Sonder shows temporary notes from people around you. Your exact location is never shown to other users."
        >
          {permissionDenied ? (
            <Text style={styles.error}>Location permission is needed to show notes around you.</Text>
          ) : null}
          <PrimaryButton loading={loading} onPress={request}>
            Allow location
          </PrimaryButton>
        </PermissionCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center"
  },
  error: {
    color: "#A64032",
    fontSize: 14,
    marginBottom: 12
  }
});

